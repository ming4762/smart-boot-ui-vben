import type { WatchStopHandle } from 'vue';

import type { Preferences } from '@vben/preferences';

import { watch } from 'vue';

import {
  clearCache,
  getInitialPreferences,
  preferences,
  resetPreferences,
  switchCacheNamespace,
  updatePreferences,
} from '@vben/preferences';
import { useTimezoneStore } from '@vben/stores';

import { notification } from 'antdv-next';

import {
  getCurrentUserPreferenceApi,
  resetCurrentUserVbenPreferenceApi,
  saveCurrentUserVbenPreferenceApi,
} from '../api';

const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0';
const SAVE_DEBOUNCE_MS = 800;
const MAX_SAVE_ATTEMPTS = 3;

let stopPreferenceWatcher: undefined | WatchStopHandle;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let syncGeneration = 0;

function getCacheNamespace(userId: number | string) {
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  return `${import.meta.env.VITE_APP_NAMESPACE}-${APP_VERSION}-${env}-user-${userId}`;
}

function getMajorVersion(version?: string) {
  return version?.split('.')[0];
}

function isCompatibleVersion(version?: string) {
  return !!version && getMajorVersion(version) === getMajorVersion(APP_VERSION);
}

function sanitizePreferenceValue(source: unknown, template: unknown): unknown {
  if (Array.isArray(template)) {
    return Array.isArray(source) ? source : undefined;
  }
  if (template && typeof template === 'object') {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      return undefined;
    }
    const result: Record<string, unknown> = {};
    for (const [key, templateValue] of Object.entries(template)) {
      if (!Object.hasOwn(source, key)) {
        continue;
      }
      const value = sanitizePreferenceValue(
        (source as Record<string, unknown>)[key],
        templateValue,
      );
      if (value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }
  return typeof source === typeof template ? source : undefined;
}

function sanitizeVbenPreferences(source: Record<string, unknown>) {
  return sanitizePreferenceValue(
    source,
    getInitialPreferences(),
  ) as Partial<Preferences>;
}

function serializePreferences() {
  const result = JSON.parse(JSON.stringify(preferences)) as Record<string, any>;
  if (result.app) {
    delete result.app.timezone;
  }
  return result;
}

async function persistPreferences(generation: number, attempt = 1) {
  if (generation !== syncGeneration) {
    return;
  }
  try {
    await saveCurrentUserVbenPreferenceApi(APP_VERSION, serializePreferences());
  } catch (error) {
    if (generation !== syncGeneration) {
      return;
    }
    if (attempt < MAX_SAVE_ATTEMPTS) {
      setTimeout(
        () => persistPreferences(generation, attempt + 1),
        attempt * 1000,
      );
      return;
    }
    notification.warning({
      title: '偏好设置同步失败',
      description: '设置已保存在当前浏览器，将在下次修改时重新同步。',
    });
    console.error('Failed to synchronize user preferences:', error);
  }
}

function startPreferenceSync() {
  stopPreferenceWatcher?.();
  const generation = ++syncGeneration;
  stopPreferenceWatcher = watch(
    preferences,
    () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(
        () => persistPreferences(generation),
        SAVE_DEBOUNCE_MS,
      );
    },
    { deep: true },
  );
}

export function stopUserPreferenceSync() {
  syncGeneration += 1;
  stopPreferenceWatcher?.();
  stopPreferenceWatcher = undefined;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = undefined;
  }
}

export async function initializeUserPreferences(userId: number | string) {
  stopUserPreferenceSync();
  await switchCacheNamespace(getCacheNamespace(userId));

  const userPreference = await getCurrentUserPreferenceApi();
  if (
    userPreference.vbenPreferences &&
    isCompatibleVersion(userPreference.schemaVersion)
  ) {
    updatePreferences(sanitizeVbenPreferences(userPreference.vbenPreferences));
  }
  if (userPreference.timezone) {
    updatePreferences({ app: { timezone: userPreference.timezone } });
    useTimezoneStore().applyTimezone(userPreference.timezone);
  }

  startPreferenceSync();
  return userPreference;
}

export async function resetCurrentUserVbenPreferences() {
  stopUserPreferenceSync();
  await resetCurrentUserVbenPreferenceApi();
  await resetPreferences();
  await clearCache();
}
