import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/sys/parameter/saveUpdateBatch',
  delete = '/sys/parameter/batchDeleteById',
  getById = '/sys/parameter/getById',
  list = '/sys/parameter/list',
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

export const deleteApi = (removeRecords: Recordable<any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const getByIdApi = (id: any) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
