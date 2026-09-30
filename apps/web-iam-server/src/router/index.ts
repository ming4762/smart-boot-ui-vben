import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import { resetStaticRoutes } from '@vben/utils';

import { createAuthShellRoutes } from '@smart/app-shell/auth';

import { createRouterGuard } from './guard';

const { publicRouteNames, routes } = createAuthShellRoutes({
  extraChildren: [
    {
      name: 'DingtalkCallback',
      path: 'dingtalk/callback',
      component: () => import('../views/_core/dingtalk-callback/index.vue'),
      meta: { title: '钉钉登录' },
    },
  ],
  rootRedirect: '/auth/login',
});

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(import.meta.env.VITE_BASE)
      : createWebHistory(import.meta.env.VITE_BASE),
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 };
  },
});

const resetRoutes = () => resetStaticRoutes(router, routes);

createRouterGuard(router, publicRouteNames);

export { resetRoutes, router };
