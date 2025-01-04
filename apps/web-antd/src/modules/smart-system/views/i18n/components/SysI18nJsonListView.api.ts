import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/sys/i18n/json/saveUpdateBatch',
  delete = '/sys/i18n/json/batchDeleteById',
  getById = '/sys/i18n/json/getById',
  list = '/sys/i18n/json/list',
  reload = '/sys/i18n/json/reload',
  setUseYn = '/sys/i18n/json/setUseYn',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params);
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList);
};

export const deleteApi = (removeRecords: Record<string, any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id);
};

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnApi = (rows: any[], useYn: boolean) => {
  return requestClient.post(Api.setUseYn, {
    idList: rows.map((item) => item.id),
    useYn,
  });
};

/**
 * 重新加载后台国际化
 */
export const reloadApi = () => {
  return requestClient.post(
    Api.reload,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
