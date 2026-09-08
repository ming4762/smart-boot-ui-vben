import type { Recordable } from '@vben/types';

/** 后端 Long 主键可能以字符串返回，禁止强制转换为 number。 */
export type PermissionId = number | string;
/** 管理表格使用的可编辑资源数据；范围和审计字段由 Adapter 控制。 */
export type PermissionRow = Recordable<any>;
/** 授权树的完整勾选与半选结果。 */
export interface FunctionSelection {
  functionIdList: PermissionId[];
  halfFunctionIdList: PermissionId[];
}
/** 授权树的数据入口，具体角色或套餐由调用参数确定。 */
export interface FunctionGrantAdapter {
  permission: string;
  listFunctions: () => Promise<PermissionRow[]>;
  load: (id: PermissionId) => Promise<FunctionSelection>;
  save: (id: PermissionId, selection: FunctionSelection) => Promise<unknown>;
}
/** 共用表格接口；所有请求必须在创建 Adapter 时绑定管理范围。 */
export interface ResourceManagementAdapter {
  scopeKey: string;
  dataPermission: boolean;
  paged: boolean;
  permissions: Record<string, string>;
  list: (query: PermissionRow) => Promise<any>;
  get: (row: PermissionRow) => Promise<PermissionRow>;
  save: (rows: PermissionRow[]) => Promise<unknown>;
  remove: (rows: PermissionRow[]) => Promise<unknown>;
  setUseYn?: (rows: PermissionRow[], useYn: boolean) => Promise<unknown>;
}
/** 功能管理使用资源接口，不自行决定客户端范围。 */
export type FunctionManagementAdapter = ResourceManagementAdapter;
/** 角色管理额外提供授权树和用户选择入口。 */
export interface RoleManagementAdapter extends ResourceManagementAdapter {
  grant: FunctionGrantAdapter;
  listUsers?: (query: PermissionRow) => Promise<any>;
  listRoleUsers: (roleIds: PermissionId[]) => Promise<PermissionRow[]>;
  saveRoleUsers: (id: PermissionId, userIds: PermissionId[]) => Promise<unknown>;
}
/** 套餐管理额外提供功能授权树。 */
export interface PackageManagementAdapter extends ResourceManagementAdapter {
  grant: FunctionGrantAdapter;
}
/** 订阅管理的套餐候选列表必须由相同客户端范围提供。 */
export interface SubscriptionManagementAdapter extends ResourceManagementAdapter {
  listPackages: () => Promise<PermissionRow[]>;
}

