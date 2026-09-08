import type {
  FunctionGrantAdapter,
  FunctionManagementAdapter,
  FunctionSelection,
  PackageManagementAdapter,
  PermissionId,
  PermissionRow,
  ResourceManagementAdapter,
  RoleManagementAdapter,
  SubscriptionManagementAdapter,
} from '@smart-module/system';

import { createClientPermissionApi } from './api';
import {
  functionTypeValues,
  getResourcePermissions,
  resourceFields,
  subscriptionPermissions,
} from './config';

/** IAM 列表无服务端分页，按既有表格搜索条件在当前客户端结果内过滤及排序。 */
function filterRows(rows: PermissionRow[], query: PermissionRow) {
  let result = [...rows];
  for (const [expression, value] of Object.entries(query?.parameter ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    const [field, operator] = expression.split('@');
    if (!field || !rows.some((row) => field in row)) continue;
    const normal = (input: unknown) => {
      if (input === true) return '1';
      if (input === false) return '0';
      return String(input ?? '');
    };
    result = result.filter((row) => {
      const actual = normal(row[field]);
      if (operator === 'in' && Array.isArray(value)) {
        return value.some(
          (item) =>
            normal(item) === actual ||
            functionTypeValues[actual] === normal(item),
        );
      }
      return operator === '='
        ? actual === normal(value)
        : actual.toLowerCase().includes(normal(value).toLowerCase());
    });
  }
  const sortName = query?.sortName ?? 'seq';
  result.sort((a, b) =>
    String(a[sortName] ?? '').localeCompare(
      String(b[sortName] ?? ''),
      undefined,
      { numeric: true },
    ),
  );
  return query?.sortOrder === 'desc' ? result.toReversed() : result;
}

/**
 * 创建不可变客户端/租户范围。切换时父组件中止 signal 并重新创建，异步请求不得读取新的 scope。
 * @param clientId 目标客户端
 * @param tenantId 角色和订阅的目标租户；未选择时不会发起这两类请求
 * @param signal 该面板实例的请求生命周期
 */
export function createIamPermissionAdapters(
  clientId: PermissionId,
  tenantId: PermissionId | undefined,
  signal: AbortSignal,
) {
  if (clientId === undefined || clientId === null)
    throw new Error('请先选择客户端');
  const scopeKey = `iam-client-${clientId}-tenant-${tenantId ?? 'none'}`;
  const { listTenantUsers, post } = createClientPermissionApi(
    clientId,
    tenantId,
    signal,
  );
  const requireTenant = () => {
    if (tenantId === undefined || tenantId === null)
      throw new Error('请先选择目标租户');
    return tenantId;
  };
  const createResource = (
    domain: string,
    key: string,
  ): ResourceManagementAdapter => {
    const scopedToTenant =
      domain === 'role' || domain === 'tenant-subscription';
    const listAll = async () => {
      if (scopedToTenant) requireTenant();
      return post<PermissionRow[]>(`${domain}/list`);
    };
    const get = async (row: PermissionRow) => {
      if (scopedToTenant) requireTenant();
      if (domain === 'tenant-subscription') {
        const rows = await listAll();
        const item = rows.find(
          (candidate) => String(candidate.id) === String(row.id),
        );
        if (!item) throw new Error('订阅不存在，请刷新');
        return { ...item };
      }
      return post<PermissionRow>(`${domain}/getById`, { id: row[key] });
    };
    const save = async (rows: PermissionRow[]) => {
      // 编辑器每次保存一条；若工具传入多条，失败即停止，不并发扩大部分成功范围。
      for (const row of rows) {
        const data = Object.fromEntries(
          (resourceFields[domain] ?? [])
            .filter(
              (field) =>
                row[field] !== undefined &&
                (field !== key || Boolean(row[field])),
            )
            .map((field) => [field, row[field]]),
        );
        if (scopedToTenant) data.tenantId = requireTenant();
        for (const field of ['effectTime', 'expireTime']) {
          const value = data[field];
          if (value && typeof value !== 'string')
            data[field] = value.toISOString();
        }
        await post(`${domain}/save`, { data });
      }
    };
    return {
      scopeKey: `${scopeKey}-${domain}`,
      dataPermission: false,
      paged: false,
      permissions: getResourcePermissions(domain),
      list: async (query) => filterRows(await listAll(), query),
      get,
      save,
      remove: (rows) => {
        if (scopedToTenant) requireTenant();
        return post(`${domain}/delete`, { ids: rows.map((row) => row[key]) });
      },
      setUseYn: async (rows, useYn) => {
        const data = await Promise.all(rows.map((row) => get(row)));
        return save(data.map((row) => ({ ...row, useYn })));
      },
    };
  };
  const functions: FunctionManagementAdapter = createResource(
    'function',
    'functionId',
  );
  const grant = (domain: string): FunctionGrantAdapter => ({
    permission: `iam:client:${domain}:grant-function`,
    listFunctions: () => functions.list({ sortName: 'seq' }),
    load: (id) => {
      if (domain === 'role') requireTenant();
      return post<FunctionSelection>(`${domain}/function/list`, { id });
    },
    save: (id, selection) => {
      if (domain === 'role') requireTenant();
      return post(`${domain}/function/save`, { id, ...selection });
    },
  });
  const roles: RoleManagementAdapter = {
    ...createResource('role', 'roleId'),
    grant: grant('role'),
    listUsers: (query) => listTenantUsers(query, requireTenant()),
    listRoleUsers: async (ids) => {
      requireTenant();
      const userIds = await post<PermissionId[]>('role/user/list', {
        id: ids[0],
      });
      return userIds.map((userId) => ({ userId }));
    },
    saveRoleUsers: (id, userIdList) => {
      requireTenant();
      return post('role/user/save', { id, userIdList });
    },
  };
  const packages: PackageManagementAdapter = {
    ...createResource('tenant-package', 'id'),
    grant: grant('tenant-package'),
  };
  const baseSubscription = createResource('tenant-subscription', 'id');
  const subscriptions: SubscriptionManagementAdapter = {
    ...baseSubscription,
    permissions: subscriptionPermissions,
    listPackages: () => packages.list({}),
    list: async (query) => {
      const [rows, packageRows] = await Promise.all([
        baseSubscription.list(query),
        packages.list({}),
      ]);
      const map = new Map<string, PermissionRow>(
        packageRows.map((row: PermissionRow) => [String(row.id), row]),
      );
      return rows.map((row: PermissionRow) => ({
        ...row,
        tenantPackage: map.get(String(row.packageId)),
        packageName: map.get(String(row.packageId))?.packageName,
        packageCode: map.get(String(row.packageId))?.packageCode,
      }));
    },
  };
  return { functions, roles, packages, subscriptions };
}
