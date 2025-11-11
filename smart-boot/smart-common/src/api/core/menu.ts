import type { RouteRecordStringComponent } from '@vben/types';

import { ApiServiceEnum } from '@vben/constants';
import { camelToLine, listToTree } from '@vben/utils';

import { requestClient } from '#/api/request';

enum Api {
  GetMenuList = '/sys/user/listUserMenu',
}

const COMPONENT_MAPPING: { [index: string]: string } = {
  '/modules/smart-system': '/smart-boot/smart-modules/smart-module-system/src',
};

namespace MenuApi {
  export interface MenuItem {
    cached?: boolean;
    component: string;
    componentName: string;
    functionId: number;
    functionName: string;
    i18nCode?: string;
    icon?: string;
    isMenu?: boolean;
    meta?: string;
    parentId: number;
    redirect?: string;
    url: string;
  }
}

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

const COMPONENT_START = '@';

const getFunctionName = (menu: MenuApi.MenuItem) => {
  const { i18nCode, functionName } = menu;
  return i18nCode ?? functionName;
};

/**
 * 获取当前登录用户菜单
 */
export async function getUserMenusApi(): Promise<RouteRecordStringComponent[]> {
  const menuList = await requestClient.post<MenuApi.MenuItem[]>(
    Api.GetMenuList,
    [],
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  // 转为路由格式
  const routeList: RouteRecordStringComponent[] = menuList.map((menu) => {
    const {
      cached,
      component,
      componentName,
      functionId,
      functionName,
      icon,
      isMenu,
      parentId,
      redirect,
      url,
      meta,
    } = menu;

    // 兼容icon
    let compatibleIcon = icon;
    if (compatibleIcon && !compatibleIcon.includes(':')) {
      compatibleIcon = `ant-design:${camelToLine(compatibleIcon)}`;
    }

    let formatComponent = component;
    if (formatComponent === 'LAYOUT') {
      formatComponent = 'BasicLayout';
    } else if (formatComponent && formatComponent.startsWith(COMPONENT_START)) {
      formatComponent = formatComponent.slice(1);
    }
    if (formatComponent) {
      for (const key of Object.keys(COMPONENT_MAPPING)) {
        if (formatComponent.startsWith(key)) {
          formatComponent =
            COMPONENT_MAPPING[key] + formatComponent.slice(key.length);
          break;
        }
      }
    }
    const routeItem: RouteRecordStringComponent = {
      component: formatComponent,
      meta: {
        ...JSON.parse(meta ?? '{}'),
        hideInMenu: isMenu === false,
        icon: compatibleIcon,
        keepAlive: !cached || cached,
        key: functionId,
        parentKey: parentId,
        title: getFunctionName(menu),
        // TODO: 由后台传送?
        queryToProps: true,
      },
      name: componentName || functionName,
      path: url || '',
      redirect,
    };
    return routeItem;
  });
  // 构建路由树
  return listToTree(
    routeList,
    (data) => data.meta?.key as number,
    (data) => data.meta?.parentKey as number,
    0,
  );
}
