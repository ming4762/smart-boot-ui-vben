import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = 'iam/oauth2/client/saveUpdateBatch',
  delete = 'iam/oauth2/client/batchDeleteById',
  getById = 'iam/oauth2/client/getById',
  initializationStatus = 'iam/oauth2/client/initializationStatus',
  initialize = 'iam/oauth2/client/initialize',
  list = 'iam/oauth2/client/list',
  listTenant = '/sys/tenant/manager/list',
  setUseYn = 'iam/oauth2/client/setUseYn',
}

export interface ClientInitializationStatus {
  initialized: boolean;
  subscribedTenantIds: Array<number | string>;
}

export interface InitializeClientParameter {
  clientId: number | string;
  overwrite: boolean;
  tenantIds: Array<number | string>;
}

/**
 * 查询客户端是否已经初始化及默认套餐当前覆盖的租户。
 *
 * @param clientId 客户端ID
 * @returns 初始化状态
 */
export const getInitializationStatusApi = (clientId: number | string) => {
  return requestClient.post<ClientInitializationStatus>(
    Api.initializationStatus,
    clientId,
    { service: ApiServiceEnum.SMART_SSO_SERVER },
  );
};

/**
 * 初始化或覆盖客户端菜单、默认套餐、租户订阅和默认角色。
 *
 * @param parameter 初始化参数
 * @returns 是否初始化成功
 */
export const initializeClientApi = (parameter: InitializeClientParameter) => {
  return requestClient.post(Api.initialize, parameter, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

/**
 * 查询可选择的租户列表。
 *
 * @param params SmartTable 查询参数
 * @returns 租户分页数据
 */
export const listTenantApi = (params: any) => {
  return requestClient.post(Api.listTenant, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listApi = (params: any) => {
  return requestClient.post(Api.list, params, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, modelList, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
  });
};

export const deleteApi = (removeRecords: Record<string, any>[]) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item) => item.id),
    { service: ApiServiceEnum.SMART_SSO_SERVER },
  );
};

export const getByIdApi = (id: number) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SSO_SERVER,
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
    { service: ApiServiceEnum.SMART_SSO_SERVER },
  );
};
