import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/smart/message/template/saveUpdateBatch',
  delete = '/smart/message/template/batchDeleteById',
  getById = '/smart/message/template/getById',
  list = '/smart/message/template/list',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

export const deleteApi = (removeRecords: Recordable<any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_MESSAGE,
    },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};
