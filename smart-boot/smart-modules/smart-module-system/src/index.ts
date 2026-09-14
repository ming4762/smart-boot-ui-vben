export * from './constants/system-constants';

// 客户端管理与独立系统共用的面板及其数据契约。
export type * from './permission-management/types';
export { default as FunctionManagementPanel } from './views/function/FunctionManagementPanel.vue';
export { default as RoleManagementPanel } from './views/role/RoleManagementPanel.vue';
export { default as TenantPackageManagementPanel } from './views/tenant/tenantPackage/TenantPackageManagementPanel.vue';
export { default as TenantSubscriptionManagementPanel } from './views/tenant/tenantManagerPlatform/components/TenantSubscriptionManagementPanel.vue';
