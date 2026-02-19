import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = 'sso/oauth2/client/saveUpdateBatch',
  delete = 'sso/oauth2/client/batchDeleteById',
  getById = 'sso/oauth2/client/getById',
  list = 'sso/oauth2/client/list',
  setUseYn = 'sso/oauth2/client/setUseYn',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_AUTH_SERVER,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_AUTH_SERVER,
  });
};

export const deleteApi = (removeRecords: Record<string, any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    { service: ApiServiceEnum.SMART_AUTH_SERVER },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_AUTH_SERVER,
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
    { service: ApiServiceEnum.SMART_AUTH_SERVER },
  );
};
