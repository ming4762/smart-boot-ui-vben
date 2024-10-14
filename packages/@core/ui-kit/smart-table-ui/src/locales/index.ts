import type { SupportedLanguagesType } from '@vben-core/preferences';

/**
 * 引入语言
 */
import vxeEnUS from 'vxe-table/lib/locale/lang/en-US';
import vxeZhCN from 'vxe-table/lib/locale/lang/zh-CN';

import enUS from './langs/en-US';
import zhCN from './langs/zh-CN';

const localeData: Record<SupportedLanguagesType, Record<string, any>> = {
  'en-US': {
    ...vxeEnUS,
    ...enUS,
  },
  'zh-CN': {
    ...vxeZhCN,
    ...zhCN,
  },
};

const getI18nData: (locale: SupportedLanguagesType) => Record<string, any> = (
  locale: SupportedLanguagesType,
) => {
  return localeData[locale];
};

export { getI18nData };
