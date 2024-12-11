import type { Recordable } from '@vben/types';

import type { EditConfigData } from './useContext';

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

export const getConfigByIdApi = (configId: number | string) => {
  return requestClient.post<EditConfigData>(Api.getConfigById, configId, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

export const saveConfigApi = (model: Recordable<any>) => {
  return requestClient.post<number>(Api.saveConfig, model, {
    service: ApiServiceEnum.SMART_CODE,
  });
};
