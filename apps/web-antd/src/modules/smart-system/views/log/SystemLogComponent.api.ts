import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  getById = 'sys/log/getById',
  list = 'sys/log/listWithTenant',
}

export const listApi = (parameter: any) => {
  return requestClient.post(
    Api.list,
    {
      sortName: 'createTime',
      sortOrder: 'desc',
      ...parameter,
    },
    { service: ApiServiceEnum.SMART_SYSTEM },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
