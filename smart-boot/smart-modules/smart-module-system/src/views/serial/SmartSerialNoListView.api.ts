import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = '/smart/tool/serial/saveUpdateBatch',
  delete = '/smart/tool/serial/batchDeleteById',
  getById = '/smart/tool/serial/getById',
  list = '/smart/tool/serial/list',
}

export const listApi = (params: any) => {
  const parameter = {
    ...params,
  };
  if (!parameter.sortName) {
    parameter.sortName = 'seq';
  }
  return requestClient.post(Api.list, parameter, {
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

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
