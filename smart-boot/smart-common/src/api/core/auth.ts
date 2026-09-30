import type { RequestClientConfig, RequestResponse } from '@vben/request';
import type { UserInfo } from '@vben/types';

import { ApiServiceEnum, baseRequestClient, requestClient } from '../request';

enum Api {
  changeTenant = '/auth/tenant/change',
  dingtalkLogin = '/auth/dingtalk/webLogin',
  dingtalkState = '/public/auth/dingtalk/state',
  getUserPermission = '/auth/getUserPermission',
  iamLoginFailure = '/public/auth/oauth2/login-failure',
  rememberLogin = '/auth/rememberLogin',
}

const createAuthRequestConfig = (
  config: RequestClientConfig = {},
): RequestClientConfig => {
  // JWT refresh token 与 SESSION Remember-Me 均通过 HttpOnly Cookie 传递。
  return {
    ...config,
    withCredentials: true,
  };
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
 * 钉钉授权前签发一次性 state；Cookie 由浏览器保存，不能由脚本读取。
 *
 * @returns 本次授权请求使用的 state
 * @throws 服务端未配置钉钉登录或请求来源不受信任时抛出
 */
export async function createDingtalkLoginStateApi(): Promise<string> {
  return requestClient.post<string>(
    Api.dingtalkState,
    {},
    createAuthRequestConfig({
      authErrorProcessed: false,
      service: ApiServiceEnum.SMART_AUTH,
    }),
  );
}

/**
 * 用钉钉授权码建立系统登录态，JWT 与 Session 模式均携带 state 绑定 Cookie。
 *
 * @param code 钉钉授权码
 * @param state 钉钉回传的一次性 state
 * @returns 系统登录结果
 * @throws 授权码或 state 失效时抛出
 */
export async function dingtalkLoginApi(code: string, state: string) {
  return requestClient.postForm<AuthApi.LoginResult>(
    Api.dingtalkLogin,
    { code, state },
    createAuthRequestConfig({
      authErrorProcessed: false,
      errorMessageMode: 'none',
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
  const response = await baseRequestClient.post<
    RequestResponse<AuthApi.RefreshTokenResult>
  >(
    '/auth/refresh',
    {},
    createAuthRequestConfig({
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
  return requestClient.post<AuthApi.LogoutResult>(
    '/auth/logout',
    {},
    createAuthRequestConfig({
      authErrorProcessed: false,
      service: ApiServiceEnum.SMART_AUTH,
    }),
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
