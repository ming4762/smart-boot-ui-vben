import type { Recordable, RouteRecordStringComponent } from '@vben/types';

import { SUPPORT_LANGUAGES } from '@vben/constants';
import { ApiServiceEnum } from '@vben/request';
import { camelToLine, listToTree } from '@vben/utils';

import { requestClient } from '#/api/request';

enum Api {
  GetMenuList = '/sys/user/listUserMenu',
}

namespace MenuApi {
  export interface MenuItem {
    url: string;
    functionName: string;
    locales?: Recordable<string>;
    icon?: string;
    functionId: number;
    parentId: number;
    component: string;
    componentName: string;
    redirect?: string;
    cached?: boolean;
    isMenu?: boolean;
  }
}

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

const COMPONENT_START = '@';

/**
 * 获取当前登录用户菜单
 */
export async function getUserMenusApi(): Promise<
  RouteRecordStringComponent<string>[]
> {
  const locale = SUPPORT_LANGUAGES.map((item) => item.value);
  const menuList = await requestClient.post<MenuApi.MenuItem[]>(
    Api.GetMenuList,
    locale,
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  // 转为路由格式
  const routeList: RouteRecordStringComponent<string>[] = menuList.map(
    (menu) => {
      const {
        cached,
        component,
        componentName,
        functionId,
        functionName,
        icon,
        isMenu,
        locales,
        parentId,
        redirect,
        url,
      } = menu;

      // 兼容icon
      let compatibleIcon = icon;
      if (compatibleIcon && !compatibleIcon.includes(':')) {
        compatibleIcon = `ant-design:${camelToLine(compatibleIcon)}`;
      }

      let formatComponent = component;
      if (formatComponent === 'LAYOUT') {
        formatComponent = 'BasicLayout';
      } else if (
        formatComponent &&
        formatComponent.startsWith(COMPONENT_START)
      ) {
        formatComponent = formatComponent.slice(1);
      }
      const routeItem: RouteRecordStringComponent<string> = {
        component: formatComponent,
        meta: {
          hideInMenu: isMenu === false,
          icon: compatibleIcon,
          keepAlive: !cached || cached,
          key: functionId,
          locales,
          parentKey: parentId,
          title: functionName,
        },
        name: componentName || functionName,
        path: url || '',
        redirect,
      };

      return routeItem;
    },
  );
  // 构建路由树
  return listToTree(
    routeList,
    (data) => data.meta?.key as number,
    (data) => data.meta?.parentKey as number,
    0,
  );
}
