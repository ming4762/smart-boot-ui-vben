import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = 'iam/oauth2/client/saveUpdateBatch',
  delete = 'iam/oauth2/client/batchDeleteById',
  getById = 'iam/oauth2/client/getById',
  initializeFunctions = 'iam/oauth2/client/initializeFunctions',
  list = 'iam/oauth2/client/list',
  setUseYn = 'iam/oauth2/client/setUseYn',
}

/**
 * 将默认功能模板复制到指定客户端。
 *
 * @param clientId 客户端ID
 * @returns 是否初始化成功
 */
export const initializeFunctionsApi = (clientId: number | string) => {
  return requestClient.post(Api.initializeFunctions, clientId, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

export const deleteApi = (removeRecords: Record<string, any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    { service: ApiServiceEnum.SMART_SSO_SERVER },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
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
    { service: ApiServiceEnum.SMART_SSO_SERVER },
  );
};
