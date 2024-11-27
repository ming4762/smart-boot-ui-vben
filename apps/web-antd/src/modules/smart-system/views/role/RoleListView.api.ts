import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  batchSaveUpdate = 'sys/role/batchSaveUpdate',
  delete = 'sys/role/batchDeleteById',
  getById = 'sys/role/getById',
  list = 'sys/role/list',
  listUser = 'sys/user/list',
  listUserByRoleId = 'sys/user/listUserByRoleId',
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
