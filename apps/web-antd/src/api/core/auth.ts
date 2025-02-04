import type { UserInfo } from '@vben/types';

import {
  ApiServiceEnum,
  baseRequestClient,
  requestClient,
} from '#/api/request';

enum Api {
  changeTenant = '/auth/tenant/change',
}

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
    code?: string;
  }

  export interface LoginRole {
    roleCode: string;
    roleName: string;
    superAdminYn: boolean;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    token: string;
    permissions: string[];
    roles: LoginRole[];
    user: UserInfo;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.postForm<AuthApi.LoginResult>('/auth/login', data, {
    errorMessageMode: 'modal',
    authErrorProcessed: false,
    service: ApiServiceEnum.SMART_AUTH,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post(
    '/auth/logout',
    {
      withCredentials: true,
    },
    {
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

/**
 * 切换租户API
 * @param tenantId 租户ID
 */
export const changeTenantApi = (tenantId: number) => {
  return requestClient.postForm<AuthApi.LoginResult>(
    Api.changeTenant,
    { tenantId },
    {
      service: ApiServiceEnum.SMART_AUTH,
      authErrorProcessed: false,
    },
  );
};
