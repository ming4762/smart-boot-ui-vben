import { requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = '/sys/microApp/microFrontend/saveUpdateBatch',
  delete = '/sys/microApp/microFrontend/batchDeleteById',
  getById = '/sys/microApp/microFrontend/getById',
  list = '/sys/microApp/microFrontend/list',
  setUseYn = '/sys/microApp/microFrontend/setUseYn',
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
