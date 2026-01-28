import type { App } from 'vue';

import WujieVue from 'wujie-vue3';

import { isMicroApp } from '#/micro-app';

/**
 * 初始化wujie主应用
 */
export function setupWujieMain(app: App) {
  if (!isMicroApp()) {
    app.use(WujieVue);
  }
}
