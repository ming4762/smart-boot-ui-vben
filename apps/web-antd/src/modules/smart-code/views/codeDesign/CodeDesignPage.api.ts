import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  getConfigById = 'db/code/main/getConfigById',
  queryDbTable = 'db/connection/queryDbTable',
  saveConfig = 'db/code/main/save',
}

/**
 * 查询数据库信息
 * @param connectionId
 * @param tableName
 */
export const queryDbTableApi = (connectionId: number, tableName: number) => {
  return requestClient.post(
    Api.queryDbTable,
    { dbConnectionId: connectionId, tableName },
    {
      service: ApiServiceEnum.SMART_CODE,
    },
  );
};

export const getConfigByIdApi = (configId: number) => {
  return requestClient.post(Api.getConfigById, configId, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const saveConfigApi = (model: Recordable<any>) => {
  return requestClient.post(Api.saveConfig, model, {
    service: ApiServiceEnum.SMART_CODE,
  });
};
