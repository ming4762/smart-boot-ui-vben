import { initComponentAdapter } from './adapter/component';
import { initSetupVbenForm } from './adapter/form';

/**
 * 初始化认证页面需要的轻量 UI Adapter。
 *
 * @returns Adapter 初始化完成后解决的 Promise
 */
async function initAuthUiAdapter(): Promise<void> {
  await initComponentAdapter();
  await initSetupVbenForm();
}

export { createAuthShellRoutes } from './routes';
export { setupSysPropertiesGuard } from './guard';
export { initAuthUiAdapter };
export type {
  AuthPageName,
  AuthShellRouteOptions,
  AuthShellRouteResult,
} from './routes';
