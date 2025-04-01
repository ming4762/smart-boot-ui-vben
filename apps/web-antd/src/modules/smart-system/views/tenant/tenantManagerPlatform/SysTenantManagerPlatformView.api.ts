import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdateSubscribe = '/sys/tenant/subscribe/saveUpdateBatch',
  bindTenantUser = '/sys/tenant/manager/bindTenantUser',
  getSubscribeById = '/sys/tenant/subscribe/getById',
  listNoBindUser = '/sys/tenant/manager/listNoBindUser',
  listSubscribe = '/sys/tenant/subscribe/listWithPackage',
  listTenant = '/sys/tenant/manager/list',
  listTenantUser = '/sys/tenant/manager/listTenantUser',
  removeBindUser = '/sys/tenant/manager/removeBindUser',
  setSubscribeUseYn = '/sys/tenant/subscribe/setUseYn',
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

/**
 * 根据租户ID查询没有绑定的套餐
 * @param data
 */
export const batchSaveUpdateSubscribeApi = (data: Recordable<any>) => {
  return requestClient.post(Api.batchSaveUpdateSubscribe, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getSubscribeByIdApi = (id: number) => {
  return requestClient.post(Api.getSubscribeById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listSubscribeApi = (params: any) => {
  return requestClient.post(Api.listSubscribe, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const setSubscribeUseYnApi = (rows: any[], useYn: boolean) => {
  return requestClient.post(
    Api.setSubscribeUseYn,
    {
      idList: rows.map((item) => item.id),
      useYn,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
