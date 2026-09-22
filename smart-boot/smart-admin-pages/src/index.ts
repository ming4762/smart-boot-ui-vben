import type { ComponentRecordType } from '@vben/types';
import type { RouteRecordRaw } from 'vue-router';

import {
  VBEN_DOC_URL,
  VBEN_ELE_PREVIEW_URL,
  VBEN_GITHUB_URL,
  VBEN_LOGO_URL,
  VBEN_NAIVE_PREVIEW_URL,
} from '@vben/constants';
import { IFrameView } from '@vben/layouts';
import { $t } from '@vben/locales';

/** 后台公共页面映射，键名保持与服务端菜单中的组件路径一致。 */
const adminPageMap: ComponentRecordType = {
  '/views/_core/about/index.vue': () =>
    import('./views/about/index.vue').then((module) => module.default),
  '/views/dashboard/analytics/index.vue': () =>
    import('./views/dashboard/analytics/index.vue').then(
      (module) => module.default,
    ),
  '/views/dashboard/workspace/index.vue': () =>
    import('./views/dashboard/workspace/index.vue').then(
      (module) => module.default,
    ),
  '/views/demos/antd/index.vue': () =>
    import('./views/demos/antd/index.vue').then((module) => module.default),
};

/** Dashboard、演示和 Vben 外部链接路由。 */
const adminPageRoutes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('page.dashboard.title'),
    },
    name: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: adminPageMap['/views/dashboard/analytics/index.vue']!,
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: $t('page.dashboard.analytics'),
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: adminPageMap['/views/dashboard/workspace/index.vue']!,
        meta: {
          icon: 'carbon:workspace',
          title: $t('page.dashboard.workspace'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: { title: $t('demos.antd') },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: adminPageMap['/views/demos/antd/index.vue']!,
      },
    ],
  },
  {
    meta: {
      badgeType: 'dot',
      icon: VBEN_LOGO_URL,
      order: 9998,
      title: $t('demos.vben.title'),
    },
    name: 'VbenProject',
    path: '/vben-admin',
    children: [
      {
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: IFrameView,
        meta: {
          icon: 'lucide:book-open-text',
          link: VBEN_DOC_URL,
          title: $t('demos.vben.document'),
        },
      },
      {
        name: 'VbenGithub',
        path: '/vben-admin/github',
        component: IFrameView,
        meta: {
          icon: 'mdi:github',
          link: VBEN_GITHUB_URL,
          title: 'Github',
        },
      },
      {
        name: 'VbenNaive',
        path: '/vben-admin/naive',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:naiveui',
          link: VBEN_NAIVE_PREVIEW_URL,
          title: $t('demos.vben.naive-ui'),
        },
      },
      {
        name: 'VbenElementPlus',
        path: '/vben-admin/ele',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:element',
          link: VBEN_ELE_PREVIEW_URL,
          title: $t('demos.vben.element-plus'),
        },
      },
    ],
  },
  {
    name: 'VbenAbout',
    path: '/vben-admin/about',
    component: adminPageMap['/views/_core/about/index.vue']!,
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: $t('demos.vben.about'),
    },
  },
];

export { adminPageMap, adminPageRoutes };
