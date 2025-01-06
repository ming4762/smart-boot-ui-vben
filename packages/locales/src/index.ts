import { unref } from 'vue';

import {
  i18n,
  loadLocaleMessages,
  loadLocalesMap,
  loadLocalesMapFromDir,
  setupI18n,
} from './i18n';

const $t = i18n.global.t;

/**
 * 国际化缓存，用于提升性能，但是会消耗更多内存
 */
const I18N_CACHE = new Map<string, Map<string, string>>();

const getKey = (key: string, args?: any) => {
  if (!args) {
    return key;
  }
  return `${key}${JSON.stringify(args)}`;
};

const $ct = (key: string, args?: any): string => {
  const locale = unref(i18n.global.locale);
  if (!I18N_CACHE.has(locale)) {
    I18N_CACHE.set(locale, new Map<string, string>());
  }
  const cacheKey = getKey(key, args);
  const localMap = I18N_CACHE.get(locale) as Map<string, string>;
  if (localMap.has(cacheKey)) {
    return localMap.get(cacheKey) as string;
  }
  const text = $t(key, args);
  localMap.set(cacheKey, text);
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
