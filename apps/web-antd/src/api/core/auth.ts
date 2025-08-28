import type { RequestResponse } from '@vben/request';
import type { UserInfo } from '@vben/types';

import { useAccessStore } from '@vben/stores';

import {
  ApiServiceEnum,
  baseRequestClient,
  requestClient,
} from '#/api/request';

enum Api {
  changeTenant = '/auth/tenant/change',
}

const REFRESH_TOKEN_HEADER = 'Authorization-refreshToken';

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
    refreshToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    code: number;
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
export async function refreshTokenApi(): Promise<string> {
  const headers = createRefreshTokenHeader();
  const response = await baseRequestClient.post<
    RequestResponse<AuthApi.RefreshTokenResult>
  >(
    '/auth/refresh',
    {},
    {
      headers,
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
  if (response.data.code !== 200) {
    throw response;
  }
  return response.data.data;
}

/**
 * 退出登录
 */
export async function logoutApi() {
  const headers = createRefreshTokenHeader();
  return requestClient.post(
    '/auth/logout',
    {
      withCredentials: true,
    },
    {
      service: ApiServiceEnum.SMART_AUTH,
      headers,
    },
  );
}

/**
 * 创建刷新token请求头
 */
const createRefreshTokenHeader = () => {
  const accessStore = useAccessStore();
  return accessStore.hasRefreshToken
    ? {
        [REFRESH_TOKEN_HEADER]: accessStore.refreshToken,
      }
    : {};
};

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
