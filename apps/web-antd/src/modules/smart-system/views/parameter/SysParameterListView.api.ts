import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = '/sys/parameter/saveUpdateBatch',
  delete = '/sys/parameter/batchDeleteById',
  deleteParameterTenant = '/sys/parameterTenant/batchDeleteById',
  getById = '/sys/parameter/getById',
  getByIdParameterTenant = '/sys/parameterTenant/getById',
  list = '/sys/parameter/listWithCommon',
  listParameterTenant = '/sys/parameterTenant/listWithTenant',
  saveParameterTenant = '/sys/parameterTenant/save',
  setUseYnParameterTenant = '/sys/parameterTenant/setUseYn',
  updateParameterTenant = '/sys/parameterTenant/update',
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

export const getByIdApi = (id: any) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listParameterTenantApi = (params: any) => {
  return requestClient.post(Api.listParameterTenant, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveParameterTenantApi = (model: any) => {
  return requestClient.post(Api.saveParameterTenant, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const updateParameterTenantApi = (model: any) => {
  return requestClient.post(Api.updateParameterTenant, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteParameterTenantApi = (
  removeRecords: Record<string, any>[],
) => {
  return requestClient.post(
    Api.deleteParameterTenant,
    removeRecords.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const getByIdParameterTenantApi = (id: number) => {
  return requestClient.post(Api.getByIdParameterTenant, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnParameterTenantApi = (rows: any[], useYn: boolean) => {
  return requestClient.post(
    Api.setUseYnParameterTenant,
    {
      idList: rows.map((item) => item.id),
      useYn,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
