import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = '/smart/message/channel/saveUpdateBatch',
  delete = '/smart/message/channel/batchDeleteById',
  getById = '/smart/message/channel/getById',
  list = '/smart/message/channel/list',
  listSmartMessageType1Enum = '/smart/message/channel/listSmartMessageType1Enum',
  listSmartMessageType2Enum = '/smart/message/channel/listSmartMessageType2Enum',
  setUseYn = '/smart/message/channel/setUseYn',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_MESSAGE,
  });
};

export const deleteApi = (removeRecords: Recordable<any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    {
      service: ApiServiceEnum.SMART_MESSAGE,
    },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_MESSAGE,
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
      service: ApiServiceEnum.SMART_MESSAGE,
    },
  );
};

export const listSmartMessageType1EnumApi = () => {
  return requestClient.post(
    Api.listSmartMessageType1Enum,
    {},
    {
      service: ApiServiceEnum.SMART_MESSAGE,
    },
  );
};

export const listSmartMessageType2EnumApi = () => {
  return requestClient.post(
    Api.listSmartMessageType2Enum,
    {},
    {
      service: ApiServiceEnum.SMART_MESSAGE,
    },
  );
};
