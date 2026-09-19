import type { RequestClientConfig, RequestResponse } from '@vben/request';
import type { UserInfo } from '@vben/types';

import { useAccessStore, useSysPropertiesStore } from '@vben/stores';

import { ApiServiceEnum, baseRequestClient, requestClient } from '../request';

enum Api {
  changeTenant = '/auth/tenant/change',
  getUserPermission = '/auth/getUserPermission',
  iamLoginFailure = '/public/auth/oauth2/login-failure',
  rememberLogin = '/auth/rememberLogin',
}

const REFRESH_TOKEN_HEADER = 'Authorization-refreshToken';

const createAuthRequestConfig = (
  config: RequestClientConfig = {},
): RequestClientConfig => {
  const sysPropertiesStore = useSysPropertiesStore();
  return sysPropertiesStore.isSessionAuthMode
    ? {
        ...config,
        withCredentials: true,
      }
    : config;
};

export namespace AuthApi {
  export interface Result<T> {
    code: number;
    data: T;
    message: string;
    subCode?: number;
    success: boolean;
  }

  export interface IamLoginFailureDiagnostic {
    errorCode: string;
    exceptionMessage?: string;
    exceptionType: string;
    oauth2ErrorId: string;
    occurredAt: string;
    registrationId: string;
    requestUri: string;
    rootCauseMessage?: string;
    rootCauseType: string;
  }

  /** 登录接口参数 */
  export interface LoginParams {
    code?: string;
    password: string;
    'remember-me'?: boolean;
    username: string;
  }

  export interface LoginRole {
    roleCode: string;
    roleName: string;
    superAdminYn: boolean;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    passwordChangeRequired?: boolean;
    passwordChangeToken?: string;
    passwordValidate?: string;
    passwordValidateErrorMessage?: string;
    // 跳转地址，如果存在则跳转到指定地址
    redirectUrl?: string;
    refreshToken?: string;
    token?: string;
  }

  export interface RefreshTokenResult {
    code: number;
    data: string;
  }

  /**
   * 用户角色权限信息
   */
  export interface UserRolePermission {
    permissions: string[];
    roles: LoginRole[];
    user: UserInfo;
  }

  /**
   * 登出接口返回参数
   */
  export interface LogoutResult {
    // 跳转URL
    redirectUrl?: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.postForm<AuthApi.LoginResult>(
    '/auth/login',
    data,
    createAuthRequestConfig({
      errorMessageMode: 'modal',
      authErrorProcessed: false,
      service: ApiServiceEnum.SMART_AUTH,
    }),
  );
}

/**
 * 使用 HttpOnly Remember-Me Cookie 恢复 Session。
 *
 * @returns 登录成功数据；Cookie 不存在或失效时抛出未认证异常
 */
export async function rememberLoginApi() {
  return requestClient.post<AuthApi.LoginResult>(
    Api.rememberLogin,
    {},
    createAuthRequestConfig({
      authErrorProcessed: false,
      errorMessageMode: 'none',
      service: ApiServiceEnum.SMART_AUTH,
    }),
  );
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
    createAuthRequestConfig({
      headers,
      service: ApiServiceEnum.SMART_AUTH,
    }),
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
  return requestClient.post<AuthApi.LogoutResult>(
    '/auth/logout',
    {},
    createAuthRequestConfig({
      authErrorProcessed: false,
      service: ApiServiceEnum.SMART_AUTH,
      headers,
    }),
  );
}

/**
 * 创建刷新token请求头
 */
const createRefreshTokenHeader = () => {
  const accessStore = useAccessStore();
  const sysPropertiesStore = useSysPropertiesStore();
  return sysPropertiesStore.isJwtAuthMode && accessStore.hasRefreshToken
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
    createAuthRequestConfig({
      service: ApiServiceEnum.SMART_AUTH,
      authErrorProcessed: false,
    }),
  );
};

export const getUserPermissionApi = () => {
  return requestClient.post<AuthApi.UserRolePermission>(
    Api.getUserPermission,
    {},
    {
      errorMessageMode: 'none',
      service: ApiServiceEnum.SMART_AUTH,
      authErrorProcessed: false,
    },
  );
};

/**
 * 查询IAM登录失败诊断信息
 */
export const getIamLoginFailureApi = (oauth2ErrorId: string) => {
  return requestClient.post<AuthApi.Result<AuthApi.IamLoginFailureDiagnostic>>(
    Api.iamLoginFailure,
    { oauth2ErrorId },
    {
      authErrorProcessed: false,
      errorMessageMode: 'none',
      responseReturn: 'body',
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
};
