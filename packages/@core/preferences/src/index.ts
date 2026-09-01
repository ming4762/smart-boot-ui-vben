/* oxlint-disable unicorn/prefer-export-from */
import type { Preferences } from './types';

import { preferencesManager } from './preferences';

export const {
  getPreferences,
  getCustomPreferences,
  getInitialCustomPreferences,
  getInitialPreferences,
  getPreferencesExtension,
  updatePreferences,
  updateCustomPreferences,
  resetPreferences,
  clearCache,
  initPreferences,
  switchCacheNamespace,
} = preferencesManager;

export const preferences: Preferences = getPreferences();

export { preferencesManager };

export * from './constants';
export type * from './types';
export * from './use-preferences';
