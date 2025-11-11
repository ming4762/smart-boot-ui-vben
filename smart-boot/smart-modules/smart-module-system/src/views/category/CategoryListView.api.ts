import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchDeleteById = '/sys/category/batchDeleteById',
  getById = '/sys/category/getById',
  list = '/sys/category/listFilterTenant',
  saveUpdate = '/sys/category/saveUpdate',
}

export const listApi = (params: Recordable<any> = {}, parentId = 0) => {
  if (params) {
    params = {
      ...params,
      parameter: {
        ...params.parameter,
        'parentId@=': parentId,
      },
    };
  }
  return requestClient.post(
    Api.list,
    { sortName: 'seq', ...params },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const saveUpdateApi = (data: any) => {
  return requestClient.post(Api.saveUpdate, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdApi = async (id: number) => {
  const result = await requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
  result.parentName = result.parent?.categoryName || '根目录';
  return result;
};

export const deleteApi = (idList: number[]) => {
  return requestClient.post(Api.batchDeleteById, idList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
