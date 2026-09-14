import { ApiServiceEnum, requestClient } from '@smart/common/api';

export interface SlowSqlDetail {
  columnList: string;
  createBy: string;
  createTime: string;
  createUserId: number;
  datasourceName: string;
  dbType: string;
  id: number;
  parameter: string;
  sqlId: number;
  sqlText: string;
  timestamp: string;
  useTime: number;
}

enum Api {
  getById = '/sys/monitor/sqlSql/getById',
  list = '/sys/monitor/sqlSql/list',
}

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdApi = (id: number) => {
  return requestClient.post<SlowSqlDetail>(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
