import type { Locale } from 'antdv-next/dist/locale/index';

import type { App } from 'vue';

import type { SupportedLanguagesType } from '@vben/locales';

import { ref } from 'vue';

import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@vben/locales';
import { preferences } from '@vben/preferences';

import antdEnLocale from 'antdv-next/dist/locale/en_US';
import antdDefaultLocale from 'antdv-next/dist/locale/zh_CN';
import dayjs from 'dayjs';

const antdLocale = ref<Locale>(antdDefaultLocale);

const modules = {
  ...import.meta.glob('./langs/**/*.json'),
};

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);

async function loadMessages(lang: SupportedLanguagesType) {
  const appLocaleMessages = await localesMap[lang]?.();
  await loadThirdPartyMessage(lang);
  return {
    ...appLocaleMessages?.default,
  };
}

async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadAntdLocale(lang), loadDayjsLocale(lang)]);
}

async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale;
  switch (lang) {
    case 'en-US': {
      locale = await import('dayjs/locale/en');
      break;
    }
    case 'zh-CN': {
      locale = await import('dayjs/locale/zh-cn');
      break;
    }
    default: {
      locale = await import('dayjs/locale/en');
    }
  }
  if (locale) {
    dayjs.locale(locale);
  }
}

async function loadAntdLocale(lang: SupportedLanguagesType) {
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

async function setupI18n(app: App) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
  });
}

export { $t, antdLocale, setupI18n };
