import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';

import { getUserMenusApi, listFavoriteFunctionIdsApi } from '@smart/common/api';
import { useMenuFavoriteStore } from '@smart/common/store';
import { getRouterHandler, isMicroApp } from '@smart/wujie';
import { message } from 'antdv-next';
import modulePageMap from 'virtual:smart-modules';

import { BasicLayout, IFrameView } from '../layouts';
import {
  allowPermissionManagementComponent,
  filterPermissionManagementMenus,
} from './permission-management-policy';

const WujieWrapper = () => import('@smart/wujie/wujie-wrapper');
const forbiddenComponent = () =>
  import('../views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const menuFavoriteStore = useMenuFavoriteStore();
  // const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');
  const allPageMap: ComponentRecordType = {
    ...import.meta.glob('../views/**/*.vue'),
    ...import.meta.glob('../modules/**/*.{vue,tsx}'),
    ...modulePageMap,
  };
  const pageMap: ComponentRecordType = Object.fromEntries(
    Object.entries(allPageMap).filter(([component]) =>
      allowPermissionManagementComponent(component),
    ),
  );

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
    MicroFrontendLayout: WujieWrapper,
  };

  const microApp = isMicroApp();
  const accessMode = microApp ? 'micro-app' : preferences.app.accessMode;
  return await generateAccessible(accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      if (microApp) {
        menuFavoriteStore.setLoaded(false);
        return filterPermissionManagementMenus(getRouterHandler?.() || []);
      } else {
        message.loading({
          content: `${$t('common.loadingMenu')}...`,
          duration: 1.5,
        });
        menuFavoriteStore.setLoaded(false);
        const [menuResult, favoriteResult] = await Promise.allSettled([
          getUserMenusApi(),
          listFavoriteFunctionIdsApi(),
        ]);
        if (menuResult.status === 'rejected') {
          throw menuResult.reason;
        }
        if (favoriteResult.status === 'fulfilled') {
          menuFavoriteStore.setFavoriteFunctionIds(favoriteResult.value);
        }
        const userMenuList = filterPermissionManagementMenus(menuResult.value);
        if (userMenuList.length > 0) {
          return userMenuList;
        }
        return [
          {
            name: 'Analytics',
            path: preferences.app.defaultHomePath,
            component: '/views/dashboard/analytics/index',
            meta: {
              affixTab: true,
              icon: 'lucide:area-chart',
              title: $t('page.dashboard.analytics'),
            },
          },
        ];
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
