import type { ChangePasswordParams, UserInfo, UserTenant } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  changePassword = 'sys/auth/changePassword',
  listCurrentUserTenant = 'sys/tenant/manager/listCurrentUserTenant',
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

/**
 * 查询当前用户的租户列表
 */
export const listCurrentUserTenantApi = async () => {
  const result = await requestClient.post<any[]>(
    Api.listCurrentUserTenant,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  return result.map<UserTenant>(
    ({ id, tenantCode, tenantName, tenantShortName, platformYn }) => {
      return {
        tenantId: id,
        tenantCode,
        tenantName,
        tenantShortName,
        platformYn,
      } as UserTenant;
    },
  );
};

/**
 * 修改密码API
 * @param params
 */
export const changePasswordApi = async (params: ChangePasswordParams) => {
  return requestClient.post(Api.changePassword, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
