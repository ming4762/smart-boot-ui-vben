import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    loginExpiredMode: 'page',
  },
  theme: {
    mode: 'light',
    radius: '0.25',
    semiDarkSidebar: true,
  },
  logo: {
    size: 30,
    sourceLight: '/logo/logo_light.svg',
    sourceWithTitleLight: '/logo/logoWithTitle_light.svg',
    sourceDark: '/logo/logo_dark.svg',
    sourceWithTitleDark: '/logo/logoWithTitle_dark.svg',
  },
});
