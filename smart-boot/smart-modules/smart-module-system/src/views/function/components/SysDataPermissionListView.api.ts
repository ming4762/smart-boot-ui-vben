import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  delete = '/sys/dataPermission/batchDeleteById',
  getById = '/sys/dataPermission/getById',
  list = '/sys/dataPermission/list',
  save = '/sys/dataPermission/save',
  setUseYn = '/sys/dataPermission/setUseYn',
  update = '/sys/dataPermission/update',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const saveApi = (model: Record<string, any>) => {
  return requestClient.post(Api.save, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const updateApi = (model: Record<string, any>) => {
  return requestClient.post(Api.update, model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (removeRecords: Record<string, any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    { service: ApiServiceEnum.SMART_SYSTEM },
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
    { service: ApiServiceEnum.SMART_SYSTEM },
  );
};
