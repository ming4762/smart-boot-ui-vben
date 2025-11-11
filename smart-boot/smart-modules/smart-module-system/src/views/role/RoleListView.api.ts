import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = 'sys/role/batchSaveUpdate',
  delete = 'sys/role/batchDeleteById',
  getById = 'sys/role/getById',
  getDataPermissionDetailById = 'sys/dataPermission/getById',
  list = 'sys/role/list',
  listDataPermissionWithFunction = 'sys/dataPermission/listAllWithFunction',
  listRoleDataPermissionId = 'sys/role/listRoleDataPermissionId',
  listUser = 'sys/user/list',
  listUserByRoleId = 'sys/user/listUserByRoleId',
  setRoleDataPermission = 'sys/role/setRoleDataPermission',
  setRoleUser = 'sys/role/setRoleUser',
}

export const listApi = (parameter: any) => {
  return requestClient.post(Api.list, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (parameter: any[]) => {
  return requestClient.post(
    Api.delete,
    parameter.map((item) => item.roleId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const getByIdApi = (model: any) => {
  return requestClient.post(Api.getById, model.roleId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listUserApi = (parameter: any) => {
  return requestClient.post(Api.listUser, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listUserByRoleIdApi = (roleIds: number[]) => {
  return requestClient.post(Api.listUserByRoleId, roleIds, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const setRoleUserApi = (roleId: number, userIdList: number[]) => {
  return requestClient.post(
    Api.setRoleUser,
    {
      roleId,
      userIdList,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const batchSaveUpdateApi = (dataList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, dataList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 数据权限列表
 */
export const listDataPermissionWithFunctionApi = () => {
  return requestClient.post(
    Api.listDataPermissionWithFunction,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 设置角色数据权限
 */
export const setRoleDataPermissionApi = (params: {
  dataPermissionIdList: number[];
  roleId: number;
}) => {
  return requestClient.post(Api.setRoleDataPermission, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 获取角色数据权限
 * @param roleId 角色ID
 */
export const listRoleDataPermissionIdApi = (roleId: number) => {
  return requestClient.post<number[]>(
    Api.listRoleDataPermissionId,
    { id: roleId },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 查询数据权限详情
 * @param dataPermissionId
 */
export const getDataPermissionDetailByIdApi = (dataPermissionId: number) => {
  return requestClient.post(Api.getDataPermissionDetailById, dataPermissionId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
