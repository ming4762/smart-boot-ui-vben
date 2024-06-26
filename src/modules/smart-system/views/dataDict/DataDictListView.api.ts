import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  listDict = 'sys/dict/listFilterTenant',
  getByIdDict = 'sys/dict/getById',
  saveUpdate = 'sys/dict/saveUpdate',
  deleteDict = 'sys/dict/batchDeleteById',

  listItem = 'sys/dictItem/list',
  getByIdItem = 'sys/dictItem/get',
  batchSaveUpdateItem = 'sys/dictItem/batchSaveUpdate',
  deleteItem = 'sys/dictItem/batchDelete',
}

export const listDictApi = (parameter) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listDict,
    data: parameter,
  });
};

export const getByIdDictApi = (id) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getByIdDict,
    data: {
      id: id,
    },
  });
};

export const saveUpdateDictApi = (parameter: Recordable) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.saveUpdate,
    data: parameter,
  });
};

export const deleteDictApi = (parameter: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.deleteDict,
    data: parameter.map((item) => item.id),
  });
};

export const listDictItemApi = (parameter) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listItem,
    data: parameter,
  });
};

export const getByIdDictItemApi = (parameter) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getByIdItem,
    data: parameter.id,
  });
};

export const batchSaveUpdateDictItemApi = (parameter: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.batchSaveUpdateItem,
    data: parameter,
  });
};

export const deleteDictItemApi = (parameter: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.deleteItem,
    data: parameter.map((item) => item.id),
  });
};
