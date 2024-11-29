import type { Recordable } from '@vben/types';

import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  createAccount = 'sys/user/createAccount',
  delete = 'sys/user/batchDeleteById',
  deptTreeList = 'sys/dept/list',
  getById = 'sys/user/getDetailById',
  getByIdWithDataScope = 'sys/user/getByIdWithDataScope',
  list = 'sys/user/list',
  listTenant = '/sys/tenant/manager/list',
  resetPassword = 'sys/user/resetPassword',
  saveAccountSetting = 'sys/user/saveAccountSetting',
  saveUpdateWithDataScope = 'sys/user/saveUpdateWithDataScope',
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

export const saveUpdateWithDataScopeApi = async ({ body }: any) => {
  const saveList = [...body.insertRecords, ...body.updateRecords];
  if (saveList.length === 0) {
    return false;
  }
  const model = saveList[0];
  if (model.userType === 'SYSTEM_USER') {
    model.deptId = null;
  }
  return requestClient.post(Api.saveUpdateWithDataScope, saveList[0], {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdWithDataScopeApi = async (params: any) => {
  const result = await requestClient.post(
    Api.getByIdWithDataScope,
    params.userId,
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  return {
    ...result,
    dataScopeList: result.dataScopeList || [],
  };
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
