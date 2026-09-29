import type { PermissionId } from '../../permission-management/types';

import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '@smart/common/api';

enum Api {
  delete = 'sys/function/batchDeleteById',
  exportTree = 'sys/function/exportTree',
  getById = 'sys/function/getById',
  importTree = 'sys/function/importTree',
  list = 'sys/function/list',
  listMicroFrontend = '/sys/microApp/microFrontend/list',
  save = 'sys/function/saveUpdate',
}

/** 功能树请求可指定应用范围和取消信号；省略应用编码时服务端使用 DEFAULT。 */
interface FunctionTreeRequestOptions {
  applicationCode?: string;
  signal?: AbortSignal;
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
    microFrontend,
  } = await requestClient.post(Api.getById, data.functionId, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
  return {
    ...functionData,
    microFrontend,
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

/**
 * 导出选中目录或菜单的完整子树。
 * @param ids 选中的目录或菜单 ID
 * @param options 应用编码和取消信号；省略应用编码时导出默认应用
 * @returns 可再次导入的功能树 JSON 字符串
 * @throws 请求失败时抛出异常
 */
export function exportTreeApi(
  ids: PermissionId[],
  options: FunctionTreeRequestOptions = {},
) {
  return requestClient.post<string>(
    Api.exportTree,
    { ids, applicationCode: options.applicationCode },
    { service: ApiServiceEnum.SMART_SYSTEM, signal: options.signal },
  );
}

/**
 * 将功能树导入指定父节点，由服务端校验类型并重新分配节点 ID。
 * @param targetId 目标节点 ID，0 表示根目录
 * @param json 待导入的功能树 JSON 字符串
 * @param options 应用编码和取消信号；省略应用编码时导入默认应用
 * @returns 新增节点数量
 * @throws 请求或数据校验失败时抛出异常
 */
export function importTreeApi(
  targetId: PermissionId,
  json: string,
  options: FunctionTreeRequestOptions = {},
) {
  return requestClient.post<number>(
    Api.importTree,
    { targetId, json, applicationCode: options.applicationCode },
    { service: ApiServiceEnum.SMART_SYSTEM, signal: options.signal },
  );
}

export const deleteApi = ({ body: { removeRecords } }: any) => {
  return requestClient.post(
    Api.delete,
    removeRecords.map((item: any) => item.functionId),
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 列表微应用前端
 * @param params
 */
export const listMicroFrontend = async (params: any) => {
  const parameter = {
    sortName: 'seq',
    'useYn@=': '1',
    ...params,
  };
  return requestClient.post<any[]>(Api.listMicroFrontend, parameter, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};
