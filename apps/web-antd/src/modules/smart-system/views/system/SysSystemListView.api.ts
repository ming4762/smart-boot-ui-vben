import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  delete = 'sys/system/batchDeleteById',
  getById = 'sys/system/getById',
  getRelatedUserId = 'sys/system/getRelatedUserId',
  list = 'sys/system/list',
  saveUpdate = 'sys/system/saveUpdate',
  setUser = 'sys/system/setUser',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateApi = (insertRecords: any[], updateRecords: any[]) => {
  return requestClient.post(
    Api.saveUpdate,
    [...insertRecords, ...updateRecords][0],
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
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

export const setUserApi = (data: {
  systemId: number;
  userIdList: number[];
}) => {
  return requestClient.post(Api.setUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getRelatedUserIdApi = (systemId: number) => {
  return requestClient.post(
    Api.getRelatedUserId,
    { id: systemId },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
