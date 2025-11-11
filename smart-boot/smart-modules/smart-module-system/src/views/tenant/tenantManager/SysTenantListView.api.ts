import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdateSubscribe = '/sys/tenant/subscribe/saveUpdateBatch',
  bindTenantUser = '/sys/tenant/manager/bindTenantUser',
  createTenantUserAccount = '/sys/tenant/manager/createTenantUserAccount',
  delete = '/sys/tenant/manager/batchDeleteById',
  getById = '/sys/tenant/manager/getById',
  getSubscribeById = '/sys/tenant/subscribe/getById',
  list = '/sys/tenant/manager/list',
  listIsolationStrategy = '/sys/tenant/manager/listIsolationStrategy',
  listNoBindPackageByTenantId = '/sys/tenant/manager/listNoBindPackageByTenantId',
  listNoBindUser = '/sys/tenant/manager/listNoBindUser',

  listSubscribe = '/sys/tenant/subscribe/listWithPackage',
  listTenantUser = '/sys/tenant/manager/listTenantUser',
  removeBindUser = '/sys/tenant/manager/removeBindUser',
  saveUpdate = '/sys/tenant/manager/saveUpdate',
  setSubscribeUseYn = '/sys/tenant/subscribe/setUseYn',
  setUseYn = '/sys/tenant/manager/setUseYn',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateApi = (model: Recordable<any>) => {
  return requestClient.post(Api.saveUpdate, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (removeRecords: Recordable<any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnApi = (rows: any[], useYn: boolean) => {
  return requestClient.post(
    Api.setUseYn,
    {
      idList: rows.map((item) => item.id),
      useYn,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 查询隔离策略
 */
export const listIsolationStrategyApi = () => {
  return requestClient.post(
    Api.listIsolationStrategy,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listTenantUserApi = (data: any) => {
  return requestClient.post(Api.listTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listNoBindUserApi = (data: any) => {
  return requestClient.post(Api.listNoBindUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const bindTenantUserApi = (data: any) => {
  return requestClient.post(Api.bindTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const removeBindUserApi = (data: any) => {
  return requestClient.post(Api.removeBindUser, data, {
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

export const getSubscribeByIdApi = (id: number) => {
  return requestClient.post(Api.getSubscribeById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 根据租户ID查询没有绑定的套餐
 * @param data
 */
export const listNoBindPackageByTenantIdApi = (data: any) => {
  return requestClient.post(Api.listNoBindPackageByTenantId, data, {
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

/**
 * 根据租户ID查询没有绑定的套餐
 * @param data
 */
export const createTenantUserAccountApi = (data: Recordable<any>) => {
  return requestClient.post(Api.createTenantUserAccount, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
