import { ApiServiceEnum } from '@vben/constants';

import { requestClient } from '../request';

enum Api {
  BatchDelete = '/sys/userFunctionFavorite/batchDeleteByFunctionId',
  Delete = '/sys/userFunctionFavorite/deleteByFunctionId',
  List = '/sys/userFunctionFavorite/listFunctionId',
  Save = '/sys/userFunctionFavorite/save',
}

const requestOptions = {
  service: ApiServiceEnum.SMART_SYSTEM,
};

export const listFavoriteFunctionIdsApi = () =>
  requestClient.post<number[]>(Api.List, {}, requestOptions);

export const saveFavoriteFunctionApi = (functionId: number) =>
  requestClient.post<boolean>(Api.Save, { id: functionId }, requestOptions);

export const deleteFavoriteFunctionApi = (functionId: number) =>
  requestClient.post<boolean>(Api.Delete, { id: functionId }, requestOptions);

export const batchDeleteFavoriteFunctionsApi = (functionIds: number[]) =>
  requestClient.post<boolean>(Api.BatchDelete, functionIds, requestOptions);
