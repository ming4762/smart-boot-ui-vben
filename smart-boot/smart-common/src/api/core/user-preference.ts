import { ApiServiceEnum } from '@vben/constants';

import { requestClient } from '../request';

export namespace UserPreferenceApi {
  export interface UserPreference {
    homeFunctionId?: number;
    homePath?: string;
    schemaVersion?: string;
    timezone?: string;
    vbenPreferences?: Record<string, unknown>;
  }
}

const API_PREFIX = '/sys/userPreference';

export function getCurrentUserPreferenceApi() {
  return requestClient.post<UserPreferenceApi.UserPreference>(
    `${API_PREFIX}/getCurrentUserPreference`,
    {},
    { service: ApiServiceEnum.SMART_SYSTEM },
  );
}

export function saveCurrentUserVbenPreferenceApi(
  schemaVersion: string,
  preferences: Record<string, unknown>,
) {
  return requestClient.post<boolean>(
    `${API_PREFIX}/saveCurrentUserVbenPreference`,
    { preferences, schemaVersion },
    { service: ApiServiceEnum.SMART_SYSTEM },
  );
}

export function resetCurrentUserVbenPreferenceApi() {
  return requestClient.post<boolean>(
    `${API_PREFIX}/resetCurrentUserVbenPreference`,
    {},
    { service: ApiServiceEnum.SMART_SYSTEM },
  );
}

export function setCurrentUserHomeApi(functionId: string) {
  return requestClient.post<boolean>(
    `${API_PREFIX}/setCurrentUserHome`,
    { functionId },
    { service: ApiServiceEnum.SMART_SYSTEM },
  );
}
