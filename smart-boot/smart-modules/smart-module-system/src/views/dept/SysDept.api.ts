import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  delete = 'sys/dept/batchDeleteById',
  getById = 'sys/dept/getById',
  listUser = 'sys/user/list',
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

export const listUserApi = (params: any) => {
  return requestClient.post(Api.listUser, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
