import type { ChangePasswordParams, UserInfo, UserTenant } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  changePassword = 'sys/auth/changePassword',
  listCurrentUserTenant = 'sys/tenant/manager/listCurrentUserTenant',
  listUser = 'sys/user/list',
  listUserById = 'sys/user/listUserById',
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

/**
 * 根据用户ID查询用户信息
 * @param userIds 用户ID列表
 */
export const listUserByIdApi = async (userIds: number[]) => {
  return requestClient.post<any[]>(Api.listUserById, userIds, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 查询用户列表
 * @param params 查询参数
 * @param useYn 是否启用
 */
export const listUserApi = (params: Record<string, any> = {}, useYn = true) => {
  let parameter = params.parameter;
  if (useYn) {
    parameter = {
      ...parameter,
      'useYn@=': true,
    };
  }
  return requestClient.post<any[]>(
    Api.listUser,
    {
      ...params,
      parameter,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
