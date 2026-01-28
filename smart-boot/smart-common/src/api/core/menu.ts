import type { RouteRecordStringComponent } from '@vben/types';

import { ApiServiceEnum } from '@vben/constants';
import { camelToLine, listToTree } from '@vben/utils';

import { requestClient } from '#/api/request';
import { MODULE_PATH_MAPPING } from '#/constants';

enum Api {
  GetMenuList = '/sys/user/listUserMenu',
}

namespace MenuApi {
  export interface FunctionMicroFrontendItem {
    // 前端微应用配置，JSON字符串
    microFrontendConfig?: string;
    // 前端微应用地址，如果为null，则根据菜单URL生成
    microFrontendPageUrl?: string;
    // 是否支持多实例
    multiInstanceYn?: boolean;
    // 是否联动路由，单实例模式才生效
    routeLinkageYn?: boolean;
  }

  export interface MicroFrontendItem {
    // 是否保活
    alive?: boolean;
    // 自定义iframe属性
    attrs?: string;
    // 应用编码
    code: string;
    // 是否降级
    degrade?: boolean;
    // 是否启用Fiber
    fiber?: boolean;
    // 应用HTML，设置后子应用将直接读取该值，没有设置则子应用通过url请求获取
    html?: string;
    // 应用名称
    name: string;
    // 短路径的能力, key为短路径, value为长路径
    prefix?: string;
    // 注入给子应用的数据
    props?: string;
    // 路由同步开关
    sync?: boolean;
    // 应用地址
    url: string;
  }
  export interface MenuItem {
    cached?: boolean;
    component: string;
    componentName: string;
    functionId: number;
    functionMicroFrontend?: FunctionMicroFrontendItem;
    functionName: string;
    i18nCode?: string;
    icon?: string;
    isMenu?: boolean;
    meta?: string;
    microFrontend?: MicroFrontendItem;
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
      functionMicroFrontend,
      microFrontend,
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
      for (const [key, mapping] of MODULE_PATH_MAPPING) {
        if (formatComponent.startsWith(key)) {
          formatComponent =
            mapping?.filePath + formatComponent.slice(key.length);
          break;
        }
      }
    }
    const metaObj = meta ? JSON.parse(meta) : {};
    let props = {
      ...metaObj.props,
    };
    if (microFrontend && functionMicroFrontend) {
      const {
        code,
        url,
        html,
        sync,
        prefix,
        alive,
        props: microFrontendProps,
        fiber,
        degrade,
        attrs,
      } = microFrontend;
      props = {
        ...props,
        ...(microFrontendProps ? JSON.parse(microFrontendProps) : {}),
        name: functionMicroFrontend.multiInstanceYn
          ? `${code}_${functionId}`
          : code,
        url: concatUrlPaths(url, functionMicroFrontend.microFrontendPageUrl),
        html,
        sync,
        prefix: prefix ? JSON.parse(prefix) : undefined,
        alive,
        fiber,
        degrade,
        attrs: attrs ? JSON.parse(attrs) : undefined,
      };
    }
    const routeItem: RouteRecordStringComponent = {
      component: formatComponent,
      meta: {
        ...metaObj,
        hideInMenu: isMenu === false,
        icon: compatibleIcon,
        keepAlive: !cached || cached,
        key: functionId,
        parentKey: parentId,
        title: getFunctionName(menu),
        // TODO: 由后台传送?
        queryToProps: true,
        multiInstanceYn: functionMicroFrontend?.multiInstanceYn,
        routeLinkageYn: functionMicroFrontend?.routeLinkageYn,
      },
      name: componentName || functionName,
      path: url || '',
      redirect,
      props: removeNullishProperties(props),
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

/**
 * 拼接URL路径，自动处理路径分隔符
 * @param path1 基础路径
 * @param path2 要拼接的路径片段，默认值为空字符串
 * @returns 拼接后的URL路径
 */
function concatUrlPaths(path1: string, path2: string = ''): string {
  // 处理第一个路径：移除末尾所有的/
  const processedPath1 = path1.replace(/\/+$/, '');
  // 处理第二个路径：移除开头所有的/
  const processedPath2 = path2.replace(/^\/+/, '');

  // 边界情况：如果其中一个路径处理后为空，直接返回另一个（避免出现多余的/）
  if (!processedPath1) return processedPath2;
  if (!processedPath2) return processedPath1;

  // 正常拼接：中间用单个/连接
  return `${processedPath1}/${processedPath2}`;
}

type NonNullishProperties<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};
function removeNullishProperties<T extends object>(
  obj: T,
): NonNullishProperties<T> {
  const result = {} as NonNullishProperties<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        (result as Record<string, unknown>)[key] = value;
      }
    }
  }
  return result;
}
