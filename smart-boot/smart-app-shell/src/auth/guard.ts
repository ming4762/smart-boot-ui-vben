import type { Router } from 'vue-router';

import { useSysPropertiesStore } from '@vben/stores';

import {
  getAuthPropertiesApi,
  getSystemPropertiesApi,
} from '@smart/common/api';

/**
 * 注册认证页面所需的系统参数守卫。
 *
 * 必须在认证判断守卫之前注册，避免 Store 的默认 JWT 模式影响登录页展示。
 *
 * @param router 路由实例
 */
function setupSysPropertiesGuard(router: Router) {
  router.beforeEach(async () => {
    const sysPropertiesStore = useSysPropertiesStore();

    if (sysPropertiesStore.captcha && sysPropertiesStore.sysParameter) {
      return true;
    }

    const [authProperties, systemProperties] = await Promise.all([
      getAuthPropertiesApi(),
      getSystemPropertiesApi(),
    ]);

    sysPropertiesStore.setProperties({
      ...authProperties,
      sysParameter: systemProperties,
    });

    return true;
  });
}

export { setupSysPropertiesGuard };
