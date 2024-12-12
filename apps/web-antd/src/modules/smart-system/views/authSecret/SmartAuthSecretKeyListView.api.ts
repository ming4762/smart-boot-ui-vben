import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/sys/auth/secret/batchSaveUpdate',
  delete = '/sys/auth/secret/batchDeleteById',
  download = 'sys/auth/secret/download',
  getById = '/sys/auth/secret/getById',
  list = '/sys/auth/secret/listBySystem',
  saveUpdate = 'sys/auth/secret/saveUpdate',
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

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateApi = (model: any) => {
  const { publicKeyFileList, privateKeyFileList } = model;
  const publicKeyFile = publicKeyFileList[0].originFileObj;
  const privateKeyFile = privateKeyFileList[0].originFileObj;
  const data = {
    ...model,
  };
  delete data.publicKeyFileList;
  delete data.privateKeyFileList;
  return requestClient.post(
    Api.saveUpdate,
    {
      data,
      file: [
        { name: 'publicKeyFile', file: publicKeyFile },
        { name: 'privateKeyFile', file: privateKeyFile },
      ],
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const download = (id: number) => {
  return requestClient.post(Api.download, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
