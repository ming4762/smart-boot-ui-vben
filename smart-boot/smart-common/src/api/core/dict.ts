import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  listDictItemByCode = 'sys/dict/batchListItemByCode',
}

/**
 * 批量获取字典项
 * @param codeList 字典编码列表
 * @return Promise<Record<string, any[]>>
 */
export const listDictItemByCodeApi = (codeList: string[]) => {
  return requestClient.post<Record<string, any[]>>(
    Api.listDictItemByCode,
    codeList,
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
