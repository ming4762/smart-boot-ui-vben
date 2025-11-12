import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = '/smart/fileStorage/saveUpdateBatch',
  delete = '/smart/fileStorage/batchDeleteById',
  getById = '/smart/fileStorage/getById',
  list = '/smart/fileStorage/list',
  setDefault = '/smart/fileStorage/setDefault',
  setEncrypt = '/smart/fileStorage/setEncrypt',
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

/**
 * 设置为加密存储器
 * @param fileStorageIdList 存储器ID列表
 */
export const setEncryptApi = (fileStorageIdList: number[]) => {
  return requestClient.post(Api.setEncrypt, fileStorageIdList, {
    service: ApiServiceEnum.SMART_FILE,
  });
};
