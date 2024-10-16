import type { SupportedLanguagesType } from '@vben-core/preferences';

/**
 * 引入语言
 */
import enUS from './langs/en-US';
import zhCN from './langs/zh-CN';

const localeData: Record<SupportedLanguagesType, Record<string, any>> = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

const getI18nData: (locale: SupportedLanguagesType) => Record<string, any> = (
  locale: SupportedLanguagesType,
) => {
  return localeData[locale];
};

export { getI18nData };
