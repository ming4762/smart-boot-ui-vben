import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/sys/tenant/manager/list',
  getById = '/sys/tenant/manager/getById',
  batchSaveUpdate = '/sys/tenant/manager/saveUpdateBatch',
  delete = '/sys/tenant/manager/batchDeleteById',
  setUseYn = '/sys/tenant/manager/setUseYn',
  listIsolationStrategy = '/sys/tenant/manager/listIsolationStrategy',
  listTenantUser = '/sys/tenant/manager/listTenantUser',
  listNoBindUser = '/sys/tenant/manager/listNoBindUser',
  bindTenantUser = '/sys/tenant/manager/bindTenantUser',
  removeBindUser = '/sys/tenant/manager/removeBindUser',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: {
      ...params,
    },
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.batchSaveUpdate,
    data: modelList,
  });
};

export const deleteApi = (removeRecords: Recordable[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.delete,
    data: removeRecords.map((item) => item.id),
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: id,
  });
};

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnApi = (rows: any[], useYn: boolean) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.setUseYn,
    data: {
      idList: rows.map((item) => item.id),
      useYn,
    },
  });
};

/**
 * 查询隔离策略
 */
export const listIsolationStrategyApi = () => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listIsolationStrategy,
  });
};

export const listTenantUserApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listTenantUser,
    data,
  });
};

export const listNoBindUserApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listNoBindUser,
    data,
  });
};

export const bindTenantUserApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.bindTenantUser,
    data,
  });
};

export const removeBindUserApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.removeBindUser,
    data,
  });
};
