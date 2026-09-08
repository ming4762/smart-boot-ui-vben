import type { PermissionId, PermissionRow } from '@smart-module/system';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

/** 客户端权限管理使用的后端接口地址。 */
enum Api {
  /** IAM Admin 中按资源类型拼接的客户端权限管理接口前缀。 */
  client = 'iam/admin/client',
  /** 当前管理员有权管理的客户端列表。 */
  listManagedClients = 'iam/admin/client/list',
  /** System 服务中指定租户下的用户列表。 */
  listTenantUsers = 'sys/user/listByTenant',
}

/** 客户端选择仅使用后端脱敏摘要。 */
export interface ManagedClient {
  /** 客户端编码。 */
  clientCode: string;
  /** 客户端主键；后端 Long 类型可能以字符串返回。 */
  clientId: PermissionId;
  /** 客户端显示名称。 */
  clientName: string;
  /** 是否启用。 */
  useYn: boolean;
}

/**
 * 读取当前管理员可管理的客户端。
 *
 * 服务端同时校验平台身份与独立管理权限；组件销毁时通过 signal 中止请求。
 * @param signal 页面请求生命周期信号
 */
export function listManagedClientsApi(signal: AbortSignal) {
  return requestClient.post<ManagedClient[]>(
    Api.listManagedClients,
    {},
    { service: ApiServiceEnum.SMART_SSO_SERVER, signal },
  );
}

/**
 * 创建绑定客户端、租户和生命周期的权限管理请求。
 *
 * 闭包固定保存创建时的管理范围，防止切换客户端或租户后，未完成的异步请求
 * 读取到新的页面状态。
 * @param clientId 目标客户端主键
 * @param tenantId 角色及订阅使用的目标租户主键
 * @param signal 当前权限面板的请求生命周期信号
 */
export function createClientPermissionApi(
  clientId: PermissionId,
  tenantId: PermissionId | undefined,
  signal: AbortSignal,
) {
  /** 请求体最后写入固定范围，调用方传入的同名字段无法覆盖 clientId 和 tenantId。 */
  const post = <T = any>(path: string, body: PermissionRow = {}) =>
    requestClient.post<T>(
      `${Api.client}/${path}`,
      { ...body, clientId, tenantId },
      { service: ApiServiceEnum.SMART_SSO_SERVER, signal },
    );

  /** 查询指定租户下的用户，供角色成员授权面板使用。 */
  const listTenantUsers = (query: PermissionRow, id: PermissionId) =>
    requestClient.post(
      Api.listTenantUsers,
      { ...query, tenantId: id },
      { service: ApiServiceEnum.SMART_SYSTEM, signal },
    );

  return { listTenantUsers, post };
}
