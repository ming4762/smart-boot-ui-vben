import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

/**
 * 应用初始化入口
 */
async function bootstrap() {
  const env = import.meta.env.PROD ? 'prod' : 'dev';
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;

  // 初始化 preferences
  await initPreferences({
    namespace,
    overrides: overridesPreferences,
  });

  // 启动应用
  const { bootstrap: appBootstrap } = await import('./bootstrap');
  appBootstrap(namespace);

  unmountGlobalLoading();
}

bootstrap();
