import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
import {
  ChangePasswordParams,
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
} from './model/userModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  changePassword = 'sys/auth/changePassword',
  listCurrentUserTenant = 'sys/tenant/manager/listCurrentUserTenant',
  changeTenant = '/auth/tenant/change',
  rememberLogin = 'auth/rememberLogin',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.postForm<LoginResultModel>(
    {
      service: ApiServiceEnum.SMART_AUTH,
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * remember login
 */
export function rememberLoginApi() {
  return defHttp.postForm<LoginResultModel>({
    service: ApiServiceEnum.SMART_AUTH,
    url: Api.rememberLogin,
  });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.postForm({ service: ApiServiceEnum.SMART_AUTH, url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

/**
 * 修改密码
 * @param params 参数
 */
export const changePasswordApi = (params: ChangePasswordParams) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.changePassword,
    data: params,
  });
};

/**
 * 查询当前用户租户列表
 */
export const listCurrentUserTenantApi = () => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listCurrentUserTenant,
  });
};

/**
 * 切换租户API
 * @param tenantId
 */
export const changeTenantApi = (tenantId: number): Promise<LoginResultModel> => {
  return defHttp.postForm({
    service: ApiServiceEnum.SMART_AUTH,
    url: Api.changeTenant,
    params: {
      tenantId,
    },
  });
};
