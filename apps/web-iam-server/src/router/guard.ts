import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import {
  useAccessStore,
  useSysPropertiesStore,
  useUserStore,
} from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { setupSysPropertiesGuard } from '@smart/app-shell/auth';

/**
 * 通用守卫配置。
 *
 * @param router IAM Server 路由实例
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
 * 判断当前是否已认证。
 *
 * @returns 当前用户是否已经建立认证状态
 */
async function isAuthenticated() {
  const accessStore = useAccessStore();
  const sysPropertiesStore = useSysPropertiesStore();
  const userStore = useUserStore();

  if (sysPropertiesStore.isJwtAuthMode) {
    return !!accessStore.accessToken;
  }
  return !!userStore.userInfo;
}

/**
 * 权限访问守卫。
 *
 * @param router IAM Server 路由实例
 * @param publicRouteNames 无需认证即可访问的路由名称
 */
function setupAccessGuard(router: Router, publicRouteNames: string[]) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore();

    const authenticated = await isAuthenticated();

    // 基本路由，这些路由不需要进入权限拦截
    if (publicRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && authenticated) {
        return decodeURIComponent(
          (to.query?.redirect as string) ||
            userStore.userInfo?.homePath ||
            preferences.app.defaultHomePath,
        );
      }
      return true;
    }

    // 未登录
    if (!authenticated) {
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
 * 项目守卫配置。
 *
 * @param router IAM Server 路由实例
 * @param publicRouteNames 无需认证即可访问的路由名称
 */
function createRouterGuard(router: Router, publicRouteNames: string[]) {
  setupCommonGuard(router);
  setupSysPropertiesGuard(router);
  setupAccessGuard(router, publicRouteNames);
}

export { createRouterGuard };
