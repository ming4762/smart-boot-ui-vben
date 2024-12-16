import {
  i18n,
  loadLocaleMessages,
  loadLocalesMap,
  loadLocalesMapFromDir,
  setupI18n,
} from './i18n';

const $t = i18n.global.t;

/**
 * 国际化缓存，用户提升性能
 */
const I18N_CACHE = new Map<string, string>();

const getKey = (key: string, args?: any[] | Record<string, any>) => {
  if (!args) {
    return key;
  }
  return `${key}${JSON.stringify(args)}`;
};

const $ct = (key: string, args?: any[] | Record<string, any>) => {
  const cacheKey = getKey(key, args);
  if (I18N_CACHE.has(cacheKey)) {
    return I18N_CACHE.get(cacheKey);
  }
  const text = $t(key, args);
  I18N_CACHE.set(cacheKey, text);
  return text;
};

export {
  $ct,
  $t,
  i18n,
  loadLocaleMessages,
  loadLocalesMap,
  loadLocalesMapFromDir,
  setupI18n,
};
export {
  type ImportLocaleFn,
  type LocaleSetupOptions,
  type SupportedLanguagesType,
} from './typing';
export type { CompileError } from '@intlify/core-base';

export { useI18n } from 'vue-i18n';

export type { Locale } from 'vue-i18n';
