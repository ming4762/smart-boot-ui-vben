import type { RouteRecordRaw } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { $t } from '@vben/locales';
import { traverseTreeValues } from '@vben/utils';

/** 可按应用启用的认证页面。 */
type AuthPageName =
  | 'code-login'
  | 'forget-password'
  | 'iam-login-failure'
  | 'login'
  | 'logout-success'
  | 'qrcode-login'
  | 'register';

/** 创建认证路由时允许应用调整的选项。 */
interface AuthShellRouteOptions {
  enabledPages?: AuthPageName[];
  extraChildren?: RouteRecordRaw[];
  includeInternalError?: boolean;
  includeNotFound?: boolean;
  rootRedirect?: string;
}

/** 认证路由及无需权限校验的路由名称。 */
interface AuthShellRouteResult {
  publicRouteNames: string[];
  routes: RouteRecordRaw[];
}

const DEFAULT_AUTH_PAGES: AuthPageName[] = [
  'login',
  'iam-login-failure',
  'logout-success',
  'code-login',
  'qrcode-login',
  'forget-password',
  'register',
];

const AUTH_PAGE_ROUTES: Record<AuthPageName, RouteRecordRaw> = {
  'code-login': {
    name: 'CodeLogin',
    path: 'code-login',
    component: () => import('./pages/code-login.vue'),
    meta: { title: $t('page.auth.codeLogin') },
  },
  'forget-password': {
    name: 'ForgetPassword',
    path: 'forget-password',
    component: () => import('./pages/forget-password.vue'),
    meta: { title: $t('page.auth.forgetPassword') },
  },
  'iam-login-failure': {
    name: 'IamLoginFailure',
    path: 'iam-login-failure',
    component: () => import('./pages/iam-login-failure.vue'),
    meta: { title: '单点登录失败' },
  },
  login: {
    name: 'Login',
    path: 'login',
    component: () => import('./pages/login.vue'),
    meta: { title: $t('page.auth.login') },
  },
  'logout-success': {
    name: 'LogoutSuccess',
    path: 'logout-success',
    component: () => import('./pages/logout-success.vue'),
    meta: { title: '退出成功' },
  },
  'qrcode-login': {
    name: 'QrCodeLogin',
    path: 'qrcode-login',
    component: () => import('./pages/qrcode-login.vue'),
    meta: { title: $t('page.auth.qrcodeLogin') },
  },
  register: {
    name: 'Register',
    path: 'register',
    component: () => import('./pages/register.vue'),
    meta: { title: $t('page.auth.register') },
  },
};

/**
 * 创建可按应用裁剪的认证路由。
 *
 * @param options 认证页面、扩展子路由和 fallback 配置
 * @returns 认证路由和对应的公开路由名称
 */
function createAuthShellRoutes(
  options: AuthShellRouteOptions = {},
): AuthShellRouteResult {
  const {
    enabledPages = DEFAULT_AUTH_PAGES,
    extraChildren = [],
    includeInternalError = true,
    includeNotFound = true,
    rootRedirect,
  } = options;

  const authenticationRoute: RouteRecordRaw = {
    component: () => import('./layouts/auth.vue'),
    meta: {
      hideInTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      ...enabledPages.map((pageName) => AUTH_PAGE_ROUTES[pageName]),
      ...extraChildren,
    ],
  };

  const publicRoutes: RouteRecordRaw[] = [authenticationRoute];
  if (rootRedirect) {
    publicRoutes.unshift({
      name: 'Root',
      path: '/',
      redirect: rootRedirect,
    });
  }
  if (includeInternalError) {
    publicRoutes.push({
      component: () => import('../shared/fallback/internal-error.vue'),
      meta: {
        hideInBreadcrumb: true,
        hideInMenu: true,
        hideInTab: true,
        title: '500',
      },
      name: 'InternalError',
      path: '/internal-error',
    });
  }

  const routes = [...publicRoutes];
  if (includeNotFound) {
    routes.push({
      component: () => import('../shared/fallback/not-found.vue'),
      meta: {
        hideInBreadcrumb: true,
        hideInMenu: true,
        hideInTab: true,
        title: '404',
      },
      name: 'FallbackNotFound',
      path: '/:path(.*)*',
    });
  }

  return {
    publicRouteNames: traverseTreeValues(
      publicRoutes,
      (route) => route.name,
    ).filter((routeName): routeName is string => typeof routeName === 'string'),
    routes,
  };
}

export { createAuthShellRoutes };
export type { AuthPageName, AuthShellRouteOptions, AuthShellRouteResult };
