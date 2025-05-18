import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  delete = 'sys/function/batchDeleteById',
  getById = 'sys/function/getById',
  list = 'sys/function/list',
  save = 'sys/function/saveUpdate',
}

export const listTree = async (params: any) => {
  const parameter = {
    sortName: 'seq',
    ...params,
    parameter: {
      QUERY_CREATE_UPDATE_USER: true,
    },
  };
  const result = await requestClient.post<any[]>(Api.list, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
  return (
    listToTree(
      result,
      (item) => item.functionId,
      (item) => item.parentId,
      0,
    ) || []
  );
};

export const listApi = (params: any) => {
  const parameter = {
    sortName: 'seq',
    ...params,
  };
  return requestClient.post<any[]>(Api.list, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const getByIdApi = async (data: any) => {
  const {
    function: functionData,
    createUser,
    parent,
    updateUser,
  } = await requestClient.post(Api.getById, data.functionId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
  return {
    ...functionData,
    createUser: createUser && createUser.fullName,
    updateUser: updateUser && updateUser.fullName,
    parentName: (parent && parent.functionName) || '根目录',
  };
};

export const saveApi = (dataList: any[]) => {
  return requestClient.post(Api.save, dataList[0], {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

export const deleteApi = ({ body: { removeRecords } }: any) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item: any) => item.functionId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
