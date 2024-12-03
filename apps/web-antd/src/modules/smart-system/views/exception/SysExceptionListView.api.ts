import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  getById = 'sys/exception/getById',
  list = 'sys/exception/list',
  markResolved = 'sys/exception/markResolved',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getById = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const markResolvedApi = (data: any) => {
  return requestClient.post(Api.markResolved, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
