import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/sys/i18n/jsonItem/saveUpdateBatch',
  delete = '/sys/i18n/jsonItem/batchDeleteById',
  getById = '/sys/i18n/jsonItem/getById',
  list = '/sys/i18n/jsonItem/list',
  setUseYn = '/sys/i18n/jsonItem/setUseYn',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (removeRecords: Record<string, any>[]) => {
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
