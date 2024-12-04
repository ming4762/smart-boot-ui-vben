import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  delete = 'smart/license/batchDeleteById',
  download = 'smart/license/download',
  generator = 'smart/license/generator',
  getById = 'smart/license/getById',
  list = 'smart/license/listBySystem',
  listFileStorage = '/smart/fileStorage/list',
  saveUpdateBatch = 'smart/license/saveUpdateBatch',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdApi = (data: any) => {
  return requestClient.post(Api.getById, data.id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateBatchApi = (dataList: any[]) => {
  return requestClient.post(Api.saveUpdateBatch, dataList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (deleteDataList: any[]) => {
  return requestClient.post(
    Api.delete,
    deleteDataList.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const generatorApi = (id: number) => {
  return requestClient.post(Api.generator, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const downloadApi = (id: number) => {
  return requestClient.post(
    Api.download,
    { id },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listFileStorageApi = (params: any) => {
  return requestClient.post(Api.listFileStorage, params, {
    service: ApiServiceEnum.SMART_FILE,
  });
};
