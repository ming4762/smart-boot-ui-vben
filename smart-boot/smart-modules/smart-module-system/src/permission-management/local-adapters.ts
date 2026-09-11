import type {
  FunctionGrantAdapter, FunctionManagementAdapter, PackageManagementAdapter,
  PermissionId, RoleManagementAdapter,
} from './types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

import * as functions from '../views/function/FunctionListView.api';
import { Permission as functionPermissions } from '../views/function/FunctionListView.config';
import * as roles from '../views/role/RoleListView.api';
import { Permission as rolePermissions } from '../views/role/RoleListView.config';
import * as packages from '../views/tenant/tenantPackage/SysTenantPackageListView.api';
import { Permission as packagePermissions } from '../views/tenant/tenantPackage/SysTenantPackageListView.config';

const service = { service: ApiServiceEnum.SMART_SYSTEM };
/** 复用本地角色接口，平台租户管理可传目标 tenantId。 */
export function createLocalRoleGrant(tenantId?: PermissionId): FunctionGrantAdapter {
  return {
    permission: rolePermissions.setFunction,
    listFunctions: () => requestClient.post('sys/function/listTenantFunction',
      { sortName: 'seq', ...(tenantId === undefined ? {} : { id: tenantId }) }, service),
    load: async (id) => ({
      functionIdList: await requestClient.post('sys/role/listFunctionId', { id }, service),
      halfFunctionIdList: [],
    }),
    save: (roleId, selection) => requestClient.post('sys/role/saveRoleMenu', { roleId, ...selection }, service),
  };
}
/** 独立系统套餐授权仍使用已有接口。 */
export function createLocalPackageGrant(): FunctionGrantAdapter {
  return {
    permission: packagePermissions.update,
    listFunctions: () => packages.listFunctionApi({ sortName: 'seq' }),
    load: async (id) => ({ functionIdList: await packages.listFunctionIdApi(id as number), halfFunctionIdList: [] }),
    save: (tenantPackageId, selection) => packages.savePackageFunctionApi({ tenantPackageId, ...selection }),
  };
}
/** 独立系统功能管理 Adapter，保持原请求格式和表格持久化 ID。 */
export function createLocalFunctionAdapter(): FunctionManagementAdapter {
  return {
    scopeKey: 'smart-system-function-functionList', dataPermission: true, paged: false,
    permissions: functionPermissions,
    list: functions.listApi, get: functions.getByIdApi, save: functions.saveApi,
    remove: (rows) => functions.deleteApi({ body: { removeRecords: rows } }),
  };
}
/** 独立系统角色管理 Adapter。 */
export function createLocalRoleAdapter(): RoleManagementAdapter {
  return {
    scopeKey: 'sys_role_list', dataPermission: true, paged: true, permissions: rolePermissions,
    list: roles.listApi, get: roles.getByIdApi, save: roles.batchSaveUpdateApi,
    remove: roles.deleteApi, grant: createLocalRoleGrant(),
    listRoleUsers: (ids) => roles.listUserByRoleIdApi(ids as number[]),
    saveRoleUsers: (id, ids) => roles.setRoleUserApi(id as number, ids as number[]),
  };
}
/** 独立系统套餐管理 Adapter。 */
export function createLocalPackageAdapter(): PackageManagementAdapter {
  return {
    scopeKey: 'smart-system-tenant-package-list-table', dataPermission: true, paged: true,
    permissions: packagePermissions, list: packages.listApi,
    get: (row) => packages.getByIdApi(row.id), save: packages.batchSaveUpdateApi,
    remove: packages.deleteApi, setUseYn: packages.setUseYnApi, grant: createLocalPackageGrant(),
  };
}
