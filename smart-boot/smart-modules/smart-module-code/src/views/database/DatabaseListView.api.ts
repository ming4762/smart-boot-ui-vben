import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchDeleteById = 'db/connection/batchDeleteById',
  createDict = '/public/db/createDic',
  getById = 'db/connection/getById',
  listBySystem = 'db/connection/listBySystem',
  listTemplate = 'db/code/template/list',
  saveUpdate = 'db/connection/saveUpdate',
  testConnected = 'db/connection/testConnection',
}

export const saveUpdateApi = (data: any) => {
  return requestClient.post(Api.saveUpdate, data, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const listApi = (data?: any) => {
  return requestClient.post(Api.listBySystem, data, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const deleteApi = async (rows: any[]) => {
  if (rows.length === 0) {
    return;
  }
  return requestClient.post(
    Api.batchDeleteById,
    rows.map((item: any) => item.id),
    {
      service: ApiServiceEnum.SMART_CODE,
    },
  );
};

export const testConnectedApi = (id: number) => {
  return requestClient.post(Api.testConnected, id, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const listTemplate = (templateType?: string) => {
  return requestClient.post(
    Api.listTemplate,
    {
      parameter: {
        'templateType@=': templateType,
      },
    },
    {
      service: ApiServiceEnum.SMART_CODE,
    },
  );
};

export const getCreateDicUrl = ({ row, templateId, tempToken }: any) => {
  return `${requestClient.getApiUrlByService(ApiServiceEnum.SMART_CODE)}/public/db/createDic?connectionId=${row.id}&templateId=${templateId}&access-token=${tempToken}`;
};
