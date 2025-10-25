import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
    // name: import.meta.env.VITE_APP_TITLE,
    name: '',
    loginExpiredMode: 'modal',
    enableRefreshToken: true,
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
  sidebar: {
    width: 235,
  },
});
