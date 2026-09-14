import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  create = '/sys/releaseNote/manage/create',
  delete = '/sys/releaseNote/manage/delete',
  getById = '/sys/releaseNote/manage/getById',
  list = '/sys/releaseNote/manage/list',
  update = '/sys/releaseNote/manage/update',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const createApi = (model: any) => {
  return requestClient.post(Api.create, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const updateApi = (model: any) => {
  return requestClient.post(Api.update, model, {
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
