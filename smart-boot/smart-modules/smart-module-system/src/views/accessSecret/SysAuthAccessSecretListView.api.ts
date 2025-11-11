import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  delete = '/sys/auth/accessSecret/batchDeleteById',
  getById = '/sys/auth/accessSecret/getById',
  list = '/sys/auth/accessSecret/listWithAll',
  saveUpdate = '/sys/auth/accessSecret/saveUpdate',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.saveUpdate, modelList[0], {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (removeRecords: Recordable[]) => {
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
