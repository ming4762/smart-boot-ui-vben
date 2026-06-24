import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

/**
 * 通用守卫配置
 */
function setupCommonGuard(router: Router) {
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    loadedPaths.add(to.path);
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * 权限访问守卫
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    const accessStore = useAccessStore();

    // 已登录用户访问登录页，跳转到首页
    if (to.path === LOGIN_PATH && accessStore.accessToken) {
      return (to.query?.redirect as string) || preferences.app.defaultHomePath;
    }

    // 未登录
    if (!accessStore.accessToken) {
      if (to.meta.ignoreAccess) {
        return true;
      }
      if (to.path !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          query: { redirect: to.fullPath },
          replace: true,
        };
      }
      return true;
    }

    return true;
  });
}

/**
 * 项目守卫配置
 */
function createRouterGuard(router: Router) {
  setupCommonGuard(router);
  setupAccessGuard(router);
}

export { createRouterGuard };
