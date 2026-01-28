import type { App } from 'vue';

import { isMicroApp } from './utils';

/**
 * 启动wujie微应用
 * @param mountHandler 挂载处理函数
 */
export async function setupWujieMicroApp(mountHandler: () => Promise<App>) {
  const wujieWindow: any = window;
  if (!isMicroApp()) {
    // 不是wujie子应用
    await mountHandler();
    return;
  }

  let app: App;
  wujieWindow.__WUJIE_MOUNT = async () => {
    app = await mountHandler();
  };

  wujieWindow.__WUJIE_UNMOUNT = () => {
    app.unmount();
  };
}
