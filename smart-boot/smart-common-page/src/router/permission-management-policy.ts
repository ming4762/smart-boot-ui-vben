import type { RouteRecordStringComponent } from '@vben/types';

/**
 * 前端管理路由可见性。默认 local 兼容独立系统，server 用于普通 IAM 服务端权限客户端，
 * iam-admin 仅供集中管理应用。该配置不替代后端鉴权。
 */
const mode = import.meta.env.VITE_PERMISSION_MANAGEMENT_MODE ?? 'local';

/** 判断组件是否允许出现在当前部署的路由表中。 */
export function allowPermissionManagementComponent(component: string) {
  if (component.includes('/IamClientPermissionManagement/')) {
    return mode === 'iam-admin';
  }
  if (mode !== 'server') return true;
  if (component.includes('smart-module-iam-admin') && !component.includes('/IamOauth2ClientPortal/')) return false;
  return !/(smart-module-system\/src|\/modules\/smart-system)\/(views\/(function|role|tenant)\/|permission-management\/)/.test(component);
}

/** 同时过滤菜单和路由来源，避免仅隐藏按钮却留下可直接访问的管理路由。 */
export function filterPermissionManagementMenus(menus: RouteRecordStringComponent[]): RouteRecordStringComponent[] {
  return menus.filter((menu) => typeof menu.component !== 'string' ||
    allowPermissionManagementComponent(menu.component)).flatMap((menu) => {
    const children = menu.children ? filterPermissionManagementMenus(menu.children) : undefined;
    if (menu.children?.length && !children?.length) return [];
    return [{ ...menu, ...(children ? { children } : {}) }];
  });
}
