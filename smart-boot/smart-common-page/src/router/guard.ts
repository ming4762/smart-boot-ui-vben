import type { Router } from 'vue-router';

import type { RouteRecordStringComponent } from '@vben/types';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import {
  useAccessStore,
  useSysPropertiesStore,
  useUserStore,
} from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import {
  getAuthPropertiesApi,
  getSystemPropertiesApi,
  getUserPermissionApi,
} from '@smart/common/api';
import {
  initializeUserPreferences,
  useAuthStore,
  useMenuFavoriteStore,
} from '@smart/common/store';
import { getRouterHandler, isMicroApp } from '@smart/wujie';

import { generateAccess } from './access';
import { accessRoutes, coreRouteNames } from './routes';

/** 权限初始化失败时使用的兜底路由，必须在请求用户权限前直接放行。 */
const INTERNAL_ERROR_ROUTE_NAME = 'InternalError';

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * 系统参数守卫配置
 * @param router
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

/**
 * 判断当前是否已认证
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
 * 判断请求失败是否由未认证导致。
 *
 * @param error 请求失败时抛出的未知错误
 * @returns 是否为 HTTP 状态或业务状态表示的未认证错误
 */
function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const unauthorizedError = error as {
    code?: number;
    response?: { data?: { code?: number }; status?: number };
  };

  // RequestClient 会将 AxiosError 解包为 response.data，因此需要兼容顶层业务 code。
  return (
    unauthorizedError.code === 401 ||
    unauthorizedError.response?.status === 401 ||
    unauthorizedError.response?.data?.code === 401
  );
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const sysPropertiesStore = useSysPropertiesStore();

    // 兜底页必须跳过权限初始化，否则接口持续失败时会形成重定向循环。
    if (to.name === INTERNAL_ERROR_ROUTE_NAME) {
      return true;
    }

    // SESSION模式下（含IAM客户端SSO），尝试通过已设置的Session Cookie获取用户信息
    // SSO/OAuth2登录成功后，后端已设置Session Cookie，但前端store中用户信息尚未加载
    // 如果不在此处加载，isAuthenticated()会一直返回false，导致无限跳转到IAM登录
    if (sysPropertiesStore.isIamClient && !userStore.userInfo) {
      try {
        const { permissions, roles, user } = await getUserPermissionApi();

        // 权限接口成功即可确认 Session 有效，偏好加载失败不应改变认证状态。
        userStore.setUserInfo({
          ...user,
          homePath: preferences.app.defaultHomePath,
          realName: user.fullName,
          roles,
        });
        accessStore.setAccessCodes(permissions);

        try {
          const userPreference = await initializeUserPreferences(user.userId);
          if (userPreference.homePath) {
            userStore.setUserInfo({
              ...user,
              homePath: userPreference.homePath,
              realName: user.fullName,
              roles,
            });
          }
        } catch {
          // 用户偏好是可选配置，失败时保留默认值并继续进入系统。
        }
      } catch (error) {
        // 只有未认证错误才进入登录流程，其他服务异常展示可恢复的兜底页。
        if (!isUnauthorizedError(error)) {
          // 不输出原始请求错误，避免 network error 中的请求配置泄露 Authorization。
          console.error('加载用户权限失败，已跳转系统异常页。');
          return {
            name: INTERNAL_ERROR_ROUTE_NAME,
            replace: true,
          };
        }
      }
    }

    const authenticated = await isAuthenticated();

    // 强制单点登录时，登录入口直接跳转到 IAM。
    // 仅接管登录入口，避免登录失败页和登出成功页产生重定向循环。
    if (
      to.path === LOGIN_PATH &&
      !authenticated &&
      sysPropertiesStore.isIamClient &&
      sysPropertiesStore.ssoAutoRedirect
    ) {
      const iamLoginUrl = authStore.getIamLoginUrl();
      if (iamLoginUrl) {
        window.location.replace(iamLoginUrl);
      }
      return false;
    }

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && authenticated) {
        return decodeURIComponent(
          (to.query?.redirect as string) ||
            userStore.userInfo?.homePath ||
            preferences.app.defaultHomePath,
        );
      }
      return true;
    }

    // accessToken 检查
    if (!authenticated) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }
      // 如果是单点登录
      // if (sysPropertiesStore.isIamClient) {
      //   // 直接跳转，取消本次路由导航，让浏览器整页跳转生效
      //   goIamLogin();
      //   return false;
      // }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    // 是否已经生成过动态路由
    if (accessStore.isAccessChecked) {
      return true;
    }

    // 生成路由表
    // 当前登录用户拥有的角色标识列表
    const userInfo = userStore.userInfo;
    const userRoles = userInfo?.roles ?? [];

    // 生成菜单和路由
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: userRoles,
      router,
      // 则会在菜单中显示，但是访问会被重定向到403
      routes: accessRoutes,
    });

    // 保存菜单信息和路由信息
    const menuFavoriteStore = useMenuFavoriteStore();
    accessStore.setAccessMenus(
      menuFavoriteStore.decorateMenus(accessibleMenus),
    );
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);

    const configuredHomePath =
      userInfo?.homePath || preferences.app.defaultHomePath;

    const requestedPath = from.query.redirect
      ? decodeURIComponent(from.query.redirect as string)
      : to.fullPath;

    const isHomeNavigation =
      requestedPath === userInfo?.homePath ||
      requestedPath === preferences.app.defaultHomePath;
    const redirectPath =
      isHomeNavigation && !isAccessiblePath(router, requestedPath)
        ? configuredHomePath
        : requestedPath;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 判断是否可以访问某个菜单
 * @param router
 * @param path
 */
function isAccessiblePath(router: Router, path?: string) {
  if (!path) return false;

  const resolved = router.resolve(path);
  const lastMatched = resolved.matched.at(-1);

  return (
    resolved.matched.length > 0 && lastMatched?.name !== 'FallbackNotFound'
  );
}

/**
 * 微应用的路由守卫
 * 用于生成微应用的路由
 * @param router
 */
function setupMicroAppGuard(router: Router) {
  if (!isMicroApp()) {
    return;
  }
  router.beforeEach(async (to) => {
    if (router.hasRoute(to.name || to.fullPath)) {
      // 路由已经存在，直接返回
      return true;
    }
    const routes = (await getRouterHandler?.()) as
      | RouteRecordStringComponent[]
      | undefined;
    if (!routes) {
      return to;
    }
    await generateAccess({
      router,
      // 则会在菜单中显示，但是访问会被重定向到403
      routes: accessRoutes,
    });
    return true;
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 系统参数 */
  setupSysPropertiesGuard(router);
  /** 权限访问 */
  if (isMicroApp()) {
    setupMicroAppGuard(router);
  } else {
    setupAccessGuard(router);
  }
}

export { createRouterGuard };
