import type { Locale } from 'ant-design-vue/es/locale';

import { ref } from 'vue';

import antdEnLocale from 'ant-design-vue/es/locale/en_US';
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN';
import { readFrontI18nApi } from '~/api/system/i18n';
// import dayjs from 'dayjs';

const antdLocale = ref<Locale>(antdDefaultLocale);

/**
 * 加载应用特有的语言包
 * 这里也可以改造为从服务端获取翻译数据
 * @param lang
 */
async function loadMessages(lang: string) {
  const [appLocaleMessages] = await Promise.all([
    readFrontI18nApi(lang),
    loadThirdPartyMessage(lang),
  ]);
  return {
    ...appLocaleMessages,
  };
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: string) {
  await Promise.all([loadAntdLocale(lang), loadDayjsLocale(lang)]);
}

/**
 * 加载dayjs的语言包
 */
async function loadDayjsLocale(_lang: string) {
  // let locale;
  // switch (lang) {
  //   case 'en-US': {
  //     locale = await import('dayjs/locale/en');
  //     break;
  //   }
  //   case 'zh-CN': {
  //     locale = await import('dayjs/locale/zh-cn');
  //     break;
  //   }
  //   // 默认使用英语
  //   default: {
  //     locale = await import('dayjs/locale/en');
  //   }
  // }
  // if (locale) {
  //   dayjs.locale(locale);
  // } else {
  //   console.error(`Failed to load dayjs locale for ${lang}`);
  // }
}

/**
 * 加载antd的语言包
 * @param lang
 */
async function loadAntdLocale(lang: string) {
  switch (lang) {
    case 'en-US': {
      antdLocale.value = antdEnLocale;
      break;
    }
    case 'zh-CN': {
      antdLocale.value = antdDefaultLocale;
      break;
    }
  }
}

export { antdLocale, loadMessages };
