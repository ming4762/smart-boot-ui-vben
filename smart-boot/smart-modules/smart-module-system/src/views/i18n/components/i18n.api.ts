import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchDeleteI18nItemById = 'sys/i18nItem/batchDeleteById',
  deleteGroup = 'sys/i18n/deleteGroup',
  getGroupById = 'sys/i18n/getGroupById',
  getI18nById = 'sys/i18n/getById',
  getI18nItemById = 'sys/i18nItem/getById',
  i18nDelete = 'sys/i18n/batchDeleteById',
  i18nSaveUpdate = 'sys/i18n/saveUpdate',
  listGroupTree = 'sys/i18n/listGroupTree',
  listI18n = 'sys/i18n/list',
  listI18nItem = 'sys/i18nItem/list',
  reload = 'sys/i18n/reload',
  saveUpdateGroup = 'sys/i18n/saveOrUpdateGroup',
  saveUpdateI18nItem = 'sys/i18nItem/saveUpdate',
}

export const listI18nApi = (params: Recordable<any>) => {
  return requestClient.post(Api.listI18n, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getI18nByIdApi = (id: number) => {
  return requestClient.post(Api.getI18nById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const i18nSaveUpdateApi = (model: any) => {
  return requestClient.post(Api.i18nSaveUpdate, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const i18nDeleteApi = (deleteData: any[]) => {
  return requestClient.post(
    Api.i18nDelete,
    deleteData.map((item) => item.i18nId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const getGroupByIdApi = (groupId: number) => {
  return requestClient.post(Api.getGroupById, groupId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listGroupTreeApi = () => {
  return requestClient.post(
    Api.listGroupTree,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const saveUpdateGroupApi = (model: Recordable<any>) => {
  return requestClient.post(Api.saveUpdateGroup, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteGroupApi = (ids: number[]) => {
  return requestClient.post(Api.deleteGroup, ids, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getI18nItemByIdApi = (id: number) => {
  return requestClient.post(Api.getI18nItemById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveUpdateI18nItemApi = (data: Recordable<any>) => {
  return requestClient.post(Api.saveUpdateI18nItem, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const batchDeleteI18nItemByIdApi = (idList: number[]) => {
  return requestClient.post(Api.batchDeleteI18nItemById, idList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listI18nItemApi = (data: any) => {
  return requestClient.post(Api.listI18nItem, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const reloadApi = () => {
  return requestClient.post(
    Api.reload,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
