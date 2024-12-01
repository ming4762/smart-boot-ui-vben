import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  delete = 'sys/dept/batchDeleteById',
  getById = 'sys/dept/getById',
  saveUpdateBatch = 'sys/dept/saveUpdateBatch',
}

export const getByIdApi = (params: any) => {
  return requestClient.post(Api.getById, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateBatchApi = (modelList: any[]) => {
  return requestClient.post(Api.saveUpdateBatch, modelList, {
    service: ApiServiceEnum.SMART_SYSTEM,
    errorMessageMode: 'modal',
  });
};

export const deleteApi = (ids: number[]) => {
  return requestClient.post(Api.delete, ids, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
