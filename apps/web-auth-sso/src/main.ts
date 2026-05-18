import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

/**
 * 应用初始化入口
 */
async function bootstrap() {
  // 初始化 preferences
  await initPreferences(overridesPreferences);

  // 启动应用
  const { bootstrap: appBootstrap } = await import('./bootstrap');
  appBootstrap('smart-auth-sso');

  unmountGlobalLoading();
}

bootstrap();
