import { ApiServiceEnum } from '@vben/constants';

import { requestClient } from '@smart/common/api';

enum Api {
  bindUser = 'sso/oauth2/client/bindUser',
  listClient = 'sso/oauth2/client/list',
  listClientUser = 'sso/oauth2/client/listClientUser',
  listUnBindUser = 'sso/oauth2/client/listUnBindUser',
  setBindUserUseYn = 'sso/oauth2/client/setBindUserUseYn',
  unBindUser = 'sso/oauth2/client/unBindUser',
}

export const listClientApi = (params: any) => {
  return requestClient.post(Api.listClient, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

/**
 * 获取客户端用户列表
 * @param params
 */
export const listClientUserApi = (params: any) => {
  return requestClient.post(Api.listClientUser, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

/**
 * 获取未绑定用户列表
 * @param params
 */
export const listUnBindUserApi = (params: any) => {
  return requestClient.post(Api.listUnBindUser, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

/**
 * 绑定用户
 * @param params
 */
export const bindUserApi = (params: any) => {
  return requestClient.post(Api.bindUser, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

/**
 * 解绑用户
 * @param params
 */
export const unBindUserApi = (params: any) => {
  return requestClient.post(Api.unBindUser, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

/**
 * 设置绑定用户使用状态
 * @param params
 */
export const setBindUserUseYnApi = (params: any) => {
  return requestClient.post(Api.setBindUserUseYn, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};
