import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  getById = '/sys/monitor/sqlSql/getById',
  list = '/sys/monitor/sqlSql/list',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
