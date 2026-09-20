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
  refreshTokenApi,
  rememberLoginApi,
} from '@smart/common/api';
import {
  initializeUserPreferences,
  useAuthStore,
  useMenuFavoriteStore,
} from '@smart/common/store';
import {
  isRememberLoginEnabled,
  setRememberLoginEnabled,
} from '@smart/common/utils';
import { getRouterHandler, isMicroApp } from '@smart/wujie';

import { generateAccess } from './access';
import { accessRoutes, coreRouteNames } from './routes';

/** 权限初始化失败时使用的兜底路由，必须在请求用户权限前直接放行。 */
const INTERNAL_ERROR_ROUTE_NAME = 'InternalError';

/** 当前页面生命周期内仅尝试一次 JWT Cookie 恢复，避免无 Cookie 时每次导航重复刷新。 */
let jwtRestoreAttempted = false;

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
    data?: { code?: number };
    response?: { data?: { code?: number }; status?: number };
  };

  // RequestClient 会将 AxiosError 解包为 response.data，因此需要兼容顶层业务 code。
  return (
    unauthorizedError.code === 401 ||
    unauthorizedError.response?.status === 401 ||
    unauthorizedError.data?.code === 401 ||
    unauthorizedError.response?.data?.code === 401
  );
}

/**
 * 使用当前 Session 加载用户，并在成功后恢复前端权限状态。
 *
 * 用户偏好属于可选配置，加载失败时不应把有效 Session 判定为未登录。
 */
async function loadSessionUser() {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const { permissions, roles, user } = await getUserPermissionApi();

  userStore.setUserInfo({
    ...user,
    homePath: preferences.app.defaultHomePath,
    realName: user.fullName,
    roles,
  });
  accessStore.setAccessCodes(permissions);

  try {
    const userPreference = await initializeUserPreferences(user.userId);
    userStore.setUserInfo({
      ...user,
      homeFunctionId: userPreference.homeFunctionId,
      homePath: preferences.app.defaultHomePath,
      realName: user.fullName,
      roles,
    });
  } catch {
    // 用户偏好不参与认证，加载失败时保留默认首页并继续进入系统。
  }
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

    // 页面刷新后优先恢复现有 Session；用户选择保持登录时，失效后再用 Remember-Me Cookie 创建新 Session。
    if (sysPropertiesStore.isSessionAuthMode && !userStore.userInfo) {
      try {
        await loadSessionUser();
      } catch (error) {
        if (isUnauthorizedError(error)) {
          if (isRememberLoginEnabled()) {
            try {
              await rememberLoginApi();
              await loadSessionUser();
            } catch (rememberError) {
              // Remember-Me 不存在或已过期属于正常未登录，不向用户展示错误提示。
              if (isUnauthorizedError(rememberError)) {
                setRememberLoginEnabled(false);
              } else {
                console.error('恢复登录状态失败，已跳转系统异常页。');
                return {
                  name: INTERNAL_ERROR_ROUTE_NAME,
                  replace: true,
                };
              }
            }
          }
        } else {
          // 不输出原始请求错误，避免 network error 中的请求配置泄露 Cookie 等信息。
          console.error('加载用户权限失败，已跳转系统异常页。');
          return {
            name: INTERNAL_ERROR_ROUTE_NAME,
            replace: true,
          };
        }
      }
    }

    // access token 只保存在内存；页面刷新后通过 HttpOnly refresh Cookie 恢复认证状态。
    if (
      sysPropertiesStore.isJwtAuthMode &&
      !accessStore.accessToken &&
      !jwtRestoreAttempted
    ) {
      jwtRestoreAttempted = true;
      try {
        const accessToken = await refreshTokenApi();
        accessStore.setAccessToken(accessToken);
        await authStore.loadUserPermission();
      } catch (error) {
        if (!isUnauthorizedError(error)) {
          // 不记录请求对象，避免错误日志意外包含 Cookie 或认证请求元数据。
          console.error('恢复 JWT 登录状态失败，已跳转系统异常页。');
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

    const configuredHomePath = resolveHomePath(
      router,
      userInfo?.homeFunctionId,
    );
    if (userInfo && userInfo.homePath !== configuredHomePath) {
      userStore.setUserInfo({ ...userInfo, homePath: configuredHomePath });
    }

    const requestedPath = from.query.redirect
      ? decodeURIComponent(from.query.redirect as string)
      : to.fullPath;
    const defaultHomeRedirect = router
      .getRoutes()
      .find(
        (route) => route.path === preferences.app.defaultHomePath,
      )?.redirect;
    const defaultHomeRedirectPath =
      typeof defaultHomeRedirect === 'string'
        ? router.resolve(defaultHomeRedirect).path
        : undefined;

    // 默认首页可能重定向到具体子页面；登录前保存的也是子页面地址，需要继续按首页处理。
    const isHomeNavigation =
      requestedPath === userInfo?.homePath ||
      requestedPath === preferences.app.defaultHomePath ||
      router.resolve(requestedPath).path === defaultHomeRedirectPath ||
      to.redirectedFrom?.path === preferences.app.defaultHomePath;
    const redirectPath = isHomeNavigation ? configuredHomePath : requestedPath;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 根据当前用户可访问的静态路由解析首页地址。
 *
 * @param router 已完成动态路由注册的路由实例
 * @param functionId 用户保存的首页功能 ID
 * @returns 可用的首页地址；菜单无权限或不可用时返回系统默认首页
 */
function resolveHomePath(router: Router, functionId?: number | string): string {
  if (functionId === undefined || functionId === null) {
    return preferences.app.defaultHomePath;
  }

  const homeRoute = router
    .getRoutes()
    .find(
      (route) => String(route.meta.functionId ?? '') === String(functionId),
    );
  const homePath = homeRoute?.path;

  // 动态路由需要参数才能访问，不能作为无需上下文即可进入的首页。
  return homePath?.startsWith('/') && !homePath.includes(':')
    ? homePath
    : preferences.app.defaultHomePath;
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
