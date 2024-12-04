import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/smart/fileStorage/saveUpdateBatch',
  delete = '/smart/fileStorage/batchDeleteById',
  getById = '/smart/fileStorage/getById',
  list = '/smart/fileStorage/list',
  setDefault = '/smart/fileStorage/setDefault',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_FILE,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_FILE,
  });
};

export const deleteApi = (removeRecords: Recordable<any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_FILE,
    },
  );
};

export const getByIdApi = (model: Recordable<any>) => {
  return requestClient.post(Api.getById, model.id, {
    service: ApiServiceEnum.SMART_FILE,
  });
};

export const setDefaultApi = (id: number) => {
  return requestClient.post(
    Api.setDefault,
    { id },
    {
      service: ApiServiceEnum.SMART_FILE,
    },
  );
};
