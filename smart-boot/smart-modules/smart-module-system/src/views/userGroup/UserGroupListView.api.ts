import type { Recordable } from '@vben/types';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  batchSaveUpdate = 'sys/userGroup/batchSaveUpdate',
  delete = 'sys/userGroup/batchDeleteById',
  getById = 'sys/userGroup/getById',
  list = 'sys/userGroup/list',
  listNoBindUser = 'sys/userGroup/listNoBindUser',
  listUserById = 'sys/userGroup/listUserById',
  listUserIdByGroupId = 'sys/userGroup/listUserIdById',
  setUser = 'sys/userGroup/saveUserGroupByGroupId',
  unBindUser = 'sys/userGroup/unBindUser',
  useYn = 'sys/userGroup/setUseYn',
}

export const listApi = (parameter: any) => {
  return requestClient.post(Api.list, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const batchSaveUpdateApi = (dataList: any[]) => {
  return requestClient.post(Api.batchSaveUpdate, dataList, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = (dataList: any[]) => {
  return requestClient.post(
    Api.delete,
    dataList.map((item) => item.groupId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const getByIdApi = (data: any) => {
  return requestClient.post(Api.getById, data.groupId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listUserIdByGroupIdApi = (groupId: number | string) => {
  return requestClient.post(Api.listUserIdByGroupId, groupId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const listUserByIdApi = (groupId: number | string) => {
  return requestClient.post(
    Api.listUserById,
    { id: groupId },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const listNoBindUserApi = (parameter: any) => {
  return requestClient.post(Api.listNoBindUser, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const setUserApi = (groupId: number, userIdList: number[]) => {
  return requestClient.post(
    Api.setUser,
    {
      groupId,
      userIdList,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

export const setUseYnApi = (data: Recordable<any>[], useYn: boolean) => {
  const idList = data.map((item) => item.groupId);
  return requestClient.post(
    Api.useYn,
    {
      idList,
      useYn,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 解绑用户
 * @param groupId
 * @param userIdList
 */
export const unBindUserApi = (
  groupId: number | string,
  userIdList: number[],
) => {
  return requestClient.post(
    Api.unBindUser,
    {
      groupId,
      userIdList,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
