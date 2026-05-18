import type { RouteRecordRaw } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';

import { $t } from '#/locales';

const AuthPageLayout = () => import('#/layouts/auth.vue');

export const coreRouteNames: string[] = [];

const coreRoutes: RouteRecordRaw[] = [
  {
    component: AuthPageLayout,
    meta: {
      hideInTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('#/views/_core/authentication/login.vue'),
        meta: { title: $t('page.auth.login') },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () => import('#/views/_core/authentication/code-login.vue'),
        meta: { title: $t('page.auth.codeLogin') },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () => import('#/views/_core/authentication/qrcode-login.vue'),
        meta: { title: $t('page.auth.qrcodeLogin') },
      },
      {
        name: 'Register',
        path: 'register',
        component: () => import('#/views/_core/authentication/register.vue'),
        meta: { title: $t('page.auth.register') },
      },
      {
        name: 'Consent',
        path: 'consent',
        component: () => import('#/views/_core/consent/index.vue'),
        meta: { title: '授权确认', ignoreAccess: true },
      },
    ],
  },
  {
    component: () => import('#/views/_core/fallback/not-found.vue'),
    meta: { hideInBreadcrumb: true, hideInMenu: true, hideInTab: true, title: '404' },
    name: 'FallbackNotFound',
    path: '/:path(.*)*',
  },
];

export const routes: RouteRecordRaw[] = [...coreRoutes];
