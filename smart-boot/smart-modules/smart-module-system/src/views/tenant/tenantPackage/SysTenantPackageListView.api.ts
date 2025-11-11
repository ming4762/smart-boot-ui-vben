import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = '/sys/tenant/package/saveUpdateBatch',
  delete = '/sys/tenant/package/batchDeleteById',
  getById = '/sys/tenant/package/getById',
  list = '/sys/tenant/package/list',
  listFunction = 'sys/function/list',
  listFunctionId = '/sys/tenant/package/listFunctionId',
  savePackageFunction = '/sys/tenant/package/savePackageFunction',
  setUseYn = '/sys/tenant/package/setUseYn',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (removeRecords: Recordable<any>[]) => {
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

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnApi = (rows: any[], useYn: boolean) => {
  return requestClient.post(
    Api.setUseYn,
    {
      idList: rows.map((item) => item.id),
      useYn,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listFunctionApi = (data: Recordable<any>) => {
  return requestClient.post(Api.listFunction, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listFunctionIdApi = (packageId: number) => {
  return requestClient.post(
    Api.listFunctionId,
    { id: packageId },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const savePackageFunctionApi = (data: Recordable<any>) => {
  return requestClient.post(Api.savePackageFunction, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
