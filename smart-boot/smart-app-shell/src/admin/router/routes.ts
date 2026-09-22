import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';

import { adminPageRoutes } from '@smart/admin-pages';

import { createAuthShellRoutes } from '../../auth/routes';
import { BasicLayout } from '../layouts';

const { publicRouteNames: authRouteNames, routes: authRoutes } =
  createAuthShellRoutes({ includeNotFound: false });

const rootRoute: RouteRecordRaw = {
  component: BasicLayout,
  meta: {
    hideInBreadcrumb: true,
    title: 'Root',
  },
  name: 'Root',
  path: '/',
  redirect: preferences.app.defaultHomePath,
  children: [],
};

const externalRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    name: 'Profile',
    path: '/profile',
    children: [
      {
        name: 'PersonalCenter',
        path: 'personal-center',
        component: () =>
          import('../pages/_core/personal-center/personal-center.vue'),
        meta: {
          title: $t('ui.widgets.personalCenter.title'),
        },
      },
    ],
  },
];

const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('../../shared/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404',
  },
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
};

/** 后台应用需要的初始路由。 */
const routes: RouteRecordRaw[] = [
  rootRoute,
  ...authRoutes,
  ...externalRoutes,
  fallbackNotFoundRoute,
];

/** 无需进入权限生成流程的后台核心路由名称。 */
const coreRouteNames = ['Root', ...authRouteNames];

/** 后台静态功能路由。 */
const accessRoutes: RouteRecordRaw[] = [...adminPageRoutes];

export { accessRoutes, coreRouteNames, routes };
