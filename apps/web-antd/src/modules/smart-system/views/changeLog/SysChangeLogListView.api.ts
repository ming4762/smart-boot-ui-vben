import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/sys/changeLog/saveUpdateBatch',
  delete = '/sys/changeLog/batchDeleteById',
  getById = '/sys/changeLog/getById',
  list = '/sys/changeLog/list',
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

export const deleteApi = (removeRecords: Record<string, any>[]) => {
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
