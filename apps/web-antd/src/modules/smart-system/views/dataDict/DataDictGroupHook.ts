import { ApiServiceEnum, requestClient } from '#/api/request';

/**
 * 通过ID查询
 * @param id ID
 */
export const handleGetById = async (id: string) => {
  return requestClient.post(
    'sys/dict/getById',
    { id },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 添加保存函数
 * @param model 添加保存参数
 */
export const handleSaveUpdate = async (model: any) => {
  return requestClient.post('sys/dict/saveUpdate', model, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

/**
 * 删除函数
 * @param idList ID列表
 */
export const handleDelete = async (idList: Array<any>) => {
  return requestClient.post('sys/dict/batchDeleteById', idList, {
    service: ApiServiceEnum.SMART_SYSTEM,
    errorMessageMode: 'modal',
  });
};
