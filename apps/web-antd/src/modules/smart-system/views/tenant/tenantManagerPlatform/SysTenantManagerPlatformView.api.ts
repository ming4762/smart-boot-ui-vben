import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  bindTenantUser = '/sys/tenant/manager/bindTenantUser',
  listNoBindUser = '/sys/tenant/manager/listNoBindUser',
  listTenant = '/sys/tenant/manager/list',
  listTenantUser = '/sys/tenant/manager/listTenantUser',
  removeBindUser = '/sys/tenant/manager/removeBindUser',
}

/**
 * 查询租户列表API
 * @param params 参数
 */
export const listTenantApi = (params: any) => {
  return requestClient.post(Api.listTenant, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const bindTenantUserApi = (data: any) => {
  return requestClient.post(Api.bindTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listNoBindUserApi = (data: any) => {
  return requestClient.post(Api.listNoBindUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const removeBindUserApi = (data: any) => {
  return requestClient.post(Api.removeBindUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listTenantUserApi = (data: any) => {
  return requestClient.post(Api.listTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
