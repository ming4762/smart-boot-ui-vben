import { loadMessages } from './utils/i18n-load-utils';

export default defineI18nLocale(async (locale) => {
  return loadMessages(locale);
});
