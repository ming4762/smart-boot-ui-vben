import type { Recordable } from '@vben/types';

import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdateSubscribe = '/sys/tenant/subscribe/saveUpdateBatch',
  bindTenantUser = '/sys/tenant/manager/bindTenantUser',
  getRoleById = 'sys/tenant/manager/getRoleById',
  getSubscribeById = '/sys/tenant/subscribe/getById',
  getUserByTenantIdWithDept = 'sys/user/getUserByTenantIdWithDept',
  listDeptTreeByTenant = '/sys/tenant/manager/listDeptByTenant',
  listNoBindUser = '/sys/tenant/manager/listNoBindUser',
  listRoleByTenantId = 'sys/role/listRoleByTenantId',
  listSubscribe = '/sys/tenant/subscribe/listWithPackage',
  listTenant = '/sys/tenant/manager/list',
  listTenantUser = '/sys/tenant/manager/listTenantUser',
  listUserByRoleTenant = 'sys/user/listUserByRoleTenant',
  listUserByTenant = 'sys/user/listByTenant',
  removeBindUser = '/sys/tenant/manager/removeBindUser',
  saveTenantUser = '/sys/tenant/manager/saveTenantUser',
  setRoleUserWithTenant = 'sys/role/setRoleUserWithTenant',
  setSubscribeUseYn = '/sys/tenant/subscribe/setUseYn',
}

/**
 * 查询租户列表API
 * @param params 参数
 */
export const listTenantApi = (params: any) => {
  return requestClient.post(Api.listTenant, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const bindTenantUserApi = (data: any) => {
  return requestClient.post(Api.bindTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listNoBindUserApi = (data: any) => {
  return requestClient.post(Api.listNoBindUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const removeBindUserApi = (data: any) => {
  return requestClient.post(Api.removeBindUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listTenantUserApi = (data: any) => {
  return requestClient.post(Api.listTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 根据租户ID查询没有绑定的套餐
 * @param data
 */
export const batchSaveUpdateSubscribeApi = (data: Recordable<any>) => {
  return requestClient.post(Api.batchSaveUpdateSubscribe, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getSubscribeByIdApi = (id: number) => {
  return requestClient.post(Api.getSubscribeById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listSubscribeApi = (params: any) => {
  return requestClient.post(Api.listSubscribe, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const setSubscribeUseYnApi = (rows: any[], useYn: boolean) => {
  return requestClient.post(
    Api.setSubscribeUseYn,
    {
      idList: rows.map((item) => item.id),
      useYn,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listRoleByTenantIdApi = (params: any) => {
  return requestClient.post(Api.listRoleByTenantId, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getRoleByIdApi = (id: number) => {
  return requestClient.post(
    Api.getRoleById,
    { id },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listUserByTenantApi = (parameter: any) => {
  return requestClient.post(Api.listUserByTenant, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listUserByRoleTenantApi = (parameter: any) => {
  return requestClient.post(Api.listUserByRoleTenant, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const setRoleUserWithTenantApi = (
  tenantId: number,
  roleId: number,
  userIdList: number[],
) => {
  return requestClient.post(
    Api.setRoleUserWithTenant,
    {
      tenantId,
      roleId,
      userIdList,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listDeptTreeByTenantApi = async (tenantId: number | undefined) => {
  if (!tenantId) {
    return [];
  }
  const dataList = await requestClient.post(
    Api.listDeptTreeByTenant,
    { id: tenantId },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  return (
    listToTree(
      dataList,
      (item) => item.deptId,
      (item) => item.parentId,
      0,
    ) || []
  );
};

export const saveTenantUserApi = (data: any) => {
  return requestClient.post(Api.saveTenantUser, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getUserByTenantIdWithDeptApi = (
  tenantId: number,
  userId: number,
) => {
  return requestClient.post(
    Api.getUserByTenantIdWithDept,
    {
      tenantId,
      id: userId,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
