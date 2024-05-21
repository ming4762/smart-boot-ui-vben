import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/smart/message/channel/list',
  getById = '/smart/message/channel/getById',
  batchSaveUpdate = '/smart/message/channel/saveUpdateBatch',
  delete = '/smart/message/channel/batchDeleteById',
  setUseYn = '/smart/message/channel/setUseYn',
  listSmartMessageType1Enum = '/smart/message/channel/listSmartMessageType1Enum',
  listSmartMessageType2Enum = '/smart/message/channel/listSmartMessageType2Enum',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.list,
    data: {
      ...params,
    },
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.batchSaveUpdate,
    data: modelList,
  });
};

export const deleteApi = (removeRecords: Recordable[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.delete,
    data: removeRecords.map((item) => item.id),
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.getById,
    data: id,
  });
};

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnApi = (rows: any[], useYn: boolean) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.setUseYn,
    data: {
      idList: rows.map((item) => item.id),
      useYn,
    },
  });
};

export const listSmartMessageType1EnumApi = () => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.listSmartMessageType1Enum,
  });
};

export const listSmartMessageType2EnumApi = () => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.listSmartMessageType2Enum,
  });
};
