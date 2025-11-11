import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdateItem = 'sys/dictItem/batchSaveUpdate',
  deleteDict = 'sys/dict/batchDeleteById',
  deleteItem = 'sys/dictItem/batchDelete',
  getByIdDict = 'sys/dict/getById',

  getByIdItem = 'sys/dictItem/get',
  listDict = 'sys/dict/listFilterTenant',
  listItem = 'sys/dictItem/list',
  saveUpdate = 'sys/dict/saveUpdate',
}

export const listDictApi = (parameter: any) => {
  return requestClient.post(Api.listDict, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdDictApi = (id: number) => {
  return requestClient.post(
    Api.getByIdDict,
    {
      id,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const saveUpdateDictApi = (parameter: Recordable<any>) => {
  return requestClient.post(Api.saveUpdate, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteDictApi = (parameter: any[]) => {
  return requestClient.post(
    Api.deleteDict,
    parameter.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listDictItemApi = (parameter: any) => {
  return requestClient.post(Api.listItem, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdDictItemApi = (parameter: any) => {
  return requestClient.post(Api.getByIdItem, parameter.id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const batchSaveUpdateDictItemApi = (parameter: any[]) => {
  return requestClient.post(Api.batchSaveUpdateItem, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteDictItemApi = (parameter: any[]) => {
  return requestClient.post(
    Api.deleteItem,
    parameter.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
