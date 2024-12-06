import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  delete = 'db/code/template/batchDeleteById',
  deleteGroupById = 'db/code/template/deleteGroupById',
  getById = 'db/code/template/getById',
  getGroupById = 'db/code/template/getGroupById',
  list = 'db/code/template/list',
  listGroup = 'db/code/template/listGroup',
  saveUpdate = 'db/code/template/saveUpdate',
  saveUpdateGroup = 'db/code/template/saveUpdateGroup',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const saveUpdateApi = (model: any) => {
  return requestClient.post(Api.saveUpdate, model, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const deleteApi = (ids: number[]) => {
  return requestClient.post(Api.delete, ids, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const listGroupApi = (data: Recordable<any>) => {
  return requestClient.post(Api.listGroup, data, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const getGroupByIdApi = (id: number) => {
  return requestClient.post(Api.getGroupById, id, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const saveUpdateGroupApi = (data: Recordable<any>) => {
  return requestClient.post(Api.saveUpdateGroup, data, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const deleteGroupByIdApi = (idList: number[]) => {
  return requestClient.post(Api.deleteGroupById, idList, {
    service: ApiServiceEnum.SMART_CODE,
  });
};
