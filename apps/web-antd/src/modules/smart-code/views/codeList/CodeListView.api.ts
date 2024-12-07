import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  delete = 'db/code/main/batchDeleteById',
  listBySystem = 'db/code/main/listBySystem',
}

export const listBySystemApi = (parameter: any) => {
  return requestClient.post(Api.listBySystem, parameter, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const deleteApi = (data: any[]) => {
  return requestClient.post(
    Api.delete,
    data.map((item: any) => item.id),
    {
      service: ApiServiceEnum.SMART_CODE,
    },
  );
};
