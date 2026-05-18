import { ApiServiceEnum, requestClient } from '@smart/common/api';

export namespace SsoAuthApi {
  export interface LoginParams {
    username: string;
    password: string;
    code?: string;
    clientId?: string;
    redirectUri?: string;
    state?: string;
    scope?: string;
  }

  export interface ConsentInfoResponse {
    clientId: string;
    clientName: string;
    scopes: string[];
    redirectUris: string[];
  }
}

/**
 * SSO 登录
 */
export async function ssoLoginApi(data: SsoAuthApi.LoginParams) {
  return requestClient.post('/auth/sso/login', data, {
    errorMessageMode: 'modal',
    authErrorProcessed: false,
    service: ApiServiceEnum.SMART_AUTH,
  });
}

/**
 * 获取授权同意页信息
 */
export async function getConsentInfoApi(clientId: string) {
  return requestClient.get<SsoAuthApi.ConsentInfoResponse>(
    '/auth/sso/consent/info',
    {
      params: { client_id: clientId },
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
}

/**
 * 同意授权
 */
export async function approveConsentApi(
  clientId: string,
  redirectUri?: string,
) {
  return requestClient.post('/auth/sso/consent/approve', null, {
    params: { client_id: clientId, redirect_uri: redirectUri },
    service: ApiServiceEnum.SMART_AUTH,
  });
}

/**
 * 拒绝授权
 */
export async function denyConsentApi(clientId: string, redirectUri?: string) {
  return requestClient.post('/auth/sso/consent/deny', null, {
    params: { client_id: clientId, redirect_uri: redirectUri },
    service: ApiServiceEnum.SMART_AUTH,
  });
}
