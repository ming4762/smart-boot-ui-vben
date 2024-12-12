import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/smart/message/systemMessage/saveUpdateBatch',
  delete = '/smart/message/systemMessage/batchDeleteById',
  getById = '/smart/message/systemMessage/getById',
  getDetailById = '/smart/message/systemMessage/getDetailById',
  list = '/smart/message/systemMessage/list',
  publish = '/smart/message/systemMessage/publish',
  revoke = '/smart/message/systemMessage/revoke',
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

export const getDetailByIdApi = (id: number) => {
  return requestClient.post(Api.getDetailById, id, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

/**
 * 发布API
 * @param ids
 */
export const publishApi = (ids: number[]) => {
  return requestClient.post(Api.publish, ids, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

/**
 * 发布API
 * @param ids
 */
export const revokeApi = (ids: number[]) => {
  return requestClient.post(Api.revoke, ids, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};
