import type { CodeSqlFormValues } from './types';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  generateMapperBySql = 'db/code/report/generateMapperBySql',
  listCurrentUserConnection = 'db/connection/listByAuth',
}

/**
 * 查询当前登录人员有权限的链接信息
 */
export const listCurrentUserConnection = () => {
  return requestClient.post(
    Api.listCurrentUserConnection,
    {},
    {
      service: ApiServiceEnum.SMART_CODE,
    },
  );
};

/**
 * 生成SQL映射
 */
export const generateMapperBySql = (params: CodeSqlFormValues) => {
  return requestClient.post(Api.generateMapperBySql, params, {
    service: ApiServiceEnum.SMART_CODE,
  });
};
