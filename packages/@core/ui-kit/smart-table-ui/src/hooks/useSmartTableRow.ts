import type { ComputedRef } from 'vue';

import type { SmartTableRenderProps } from '../types';
import type { SmartTableContextHandler } from '../types/SmartTableInnerType';

import { unref } from 'vue';

const useSmartTableRow = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  getSmartTableContext: SmartTableContextHandler,
) => {
  /**
   * 校验是否有keyField
   */
  const validateHasKeyField = () => {
    const keyField = unref(tableProps).rowConfig?.keyField;
    if (!keyField) {
      throw new Error('rowConfig.keyField is required');
    }
    return true;
  };

  /**
   * 校验是否有proxyConfig.ajax.getById
   */
  const validateHasProxyGetById = () => {
    const getById = unref(tableProps).proxyConfig?.ajax?.getById;
    if (!getById) {
      throw new Error('proxyConfig.ajax.getById is required');
    }
    return getById;
  };

  const doUpdateRowById = async (
    id: number | string,
    getByIdHandler: (params: any) => Promise<any>,
  ) => {
    // 查询行数据
    const { getGrid } = getSmartTableContext();
    const grid = getGrid();
    const oldRow = grid.getRowById(id);
    if (!oldRow) {
      return {
        [id]: false,
      };
    }
    const newRow = await getByIdHandler(oldRow);
    newRow ? await grid.setRow(oldRow, newRow) : await grid.remove(oldRow);
    return {
      [id]: true,
    };
  };

  /**
   * 根据id更新行数据
   * @param id
   */
  const updateRowByIdProxy = async (
    id: Array<number | string> | number | string,
  ): Promise<boolean | Record<number | string, boolean>> => {
    validateHasKeyField();
    const getByIdHandler = validateHasProxyGetById();

    const ids = Array.isArray(id) ? id : [id];
    if (ids.length === 0) {
      return false;
    }
    const updateResult = await Promise.all(
      ids.map((id) => {
        return doUpdateRowById(id, getByIdHandler);
      }),
    );
    if (ids.length === 1) {
      return updateResult[0]?.[id as number | string] as boolean;
    }
    const result: Record<number | string, boolean> = {};
    updateResult.forEach((item) => {
      Object.assign(result, item);
    });
    return result;
  };

  return {
    updateRowByIdProxy,
  };
};

export { useSmartTableRow };
