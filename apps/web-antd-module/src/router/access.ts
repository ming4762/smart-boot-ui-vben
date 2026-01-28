import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { getUserMenusApi } from '@smart/common/api';
import { getRouterHandler, isMicroApp } from '@smart/wujie';
import { message } from 'ant-design-vue';
import modulePageMap from 'virtual:smart-modules';

import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const WujieVue = () => import('@smart/wujie').then((mod) => mod.WujieVue);
const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  // const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');
  const pageMap: ComponentRecordType = {
    ...import.meta.glob('../views/**/*.vue'),
    ...import.meta.glob('../modules/**/*.{vue,tsx}'),
    ...modulePageMap,
  };

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
    WujieVue,
  };

  const microApp = isMicroApp();
  const accessMode = microApp ? 'micro-app' : preferences.app.accessMode;
  return await generateAccessible(accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      if (microApp) {
        return getRouterHandler?.() || [];
      } else {
        message.loading({
          content: `${$t('common.loadingMenu')}...`,
          duration: 1.5,
        });
        return await getUserMenusApi();
      }
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
