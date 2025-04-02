import type { Recordable } from '@vben/types';

import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  createAccount = 'sys/user/createAccount',
  delete = 'sys/user/batchDeleteById',
  deptTreeList = 'sys/dept/list',
  getById = 'sys/user/getDetailById',
  getUserByIdWithDept = 'sys/user/getUserByIdWithDept',
  list = 'sys/user/listWithAccount',
  listTenant = '/sys/tenant/manager/list',
  resetPassword = 'sys/user/resetPassword',
  saveAccountSetting = 'sys/user/saveAccountSetting',
  saveUpdateWithDept = 'sys/user/saveUpdateWithDept',
  setUserRole = 'sys/user/setRole',
  setUseYn = 'sys/user/setUseYn',
  unlockUserAccount = 'sys/user/unlockUserAccount',
}

export const listApi = (ajaxParameter: any) => {
  return requestClient.post(Api.list, ajaxParameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (params: any) => {
  return requestClient.post(
    Api.delete,
    params.body.removeRecords.map((item: any) => item.userId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const saveUpdateWithDeptApi = async ({ body }: any) => {
  const saveList = [...body.insertRecords, ...body.updateRecords];
  if (saveList.length === 0) {
    return false;
  }
  const model = saveList[0];
  if (model.userType === 'SYSTEM_USER') {
    model.deptId = null;
  }
  return requestClient.post(Api.saveUpdateWithDept, saveList[0], {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getUserByIdWithDeptApi = async (params: any) => {
  return await requestClient.post(Api.getUserByIdWithDept, params.userId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const setUseYnApi = (
  userList: any[],
  useYn: boolean,
  params?: Recordable<any>,
) => {
  return requestClient.post(
    Api.setUseYn,
    {
      idList: userList.map((item) => item.userId),
      useYn,
      ...params,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const createAccountApi = (userList: any[]) => {
  return requestClient.post(
    Api.createAccount,
    userList.map((item) => item.userId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const saveAccountSettingApi = (data: any) => {
  return requestClient.post(Api.saveAccountSetting, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdApi = (id: null | string) => {
  return requestClient.post(Api.getById, id, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getDeptTreeListApi = async () => {
  const data = await requestClient.post(
    Api.deptTreeList,
    {
      sortName: 'seq',
      propertyList: ['deptId', 'deptName', 'parentId'],
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  return (
    listToTree(
      data,
      (item) => item.deptId,
      (item) => item.parentId,
      0,
    ) || []
  );
};

export const unlockUserAccountApi = (id: number) => {
  return requestClient.post(
    Api.unlockUserAccount,
    { id },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const resetPassword = (id: number) => {
  return requestClient.post(
    Api.resetPassword,
    {
      id,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const setUserRoleApi = (data: Recordable<any>) => {
  return requestClient.post(Api.setUserRole, data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listTenantApi = (params: any) => {
  return requestClient.post(Api.listTenant, params, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
