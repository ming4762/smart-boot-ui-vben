import type { VxeGridInstance } from 'vxe-table';

import { computed } from 'vue';

const SMART_TABLE_CUSTOM_COLUMN_SORT = 'SMART_TABLE_CUSTOM_COLUMN_SORT';

export const useSmartTableColumnConfig = (
  getGrid: () => undefined | VxeGridInstance,
) => {
  const setColumnSortConfig = () => {
    const grid = getGrid();
    if (!grid) {
      return;
    }
    const fullColumnList = grid?.getTableColumn()?.fullColumn || [];
    const tableId = grid?.id;
    if (!tableId) {
      return;
    }
    const columns = fullColumnList
      .map((item) => {
        const field = item.field;
        if (!field) {
          console.warn(item);
          console.warn('SMART-TABLE：列未设置field，列顺序设置无法正常使用');
        }
        return field;
      })
      .filter((item) => item !== undefined && item !== null);
    // TODO:使用统一缓存
    const allConfig: any =
      JSON.parse(
        localStorage.getItem(SMART_TABLE_CUSTOM_COLUMN_SORT) || '{}',
      ) || {};
    allConfig[tableId as string] = columns;
    localStorage.setItem(
      SMART_TABLE_CUSTOM_COLUMN_SORT,
      JSON.stringify(allConfig),
    );
  };

  const getColumnSortConfig = (tableId: string) => {
    return JSON.parse(
      localStorage.getItem(SMART_TABLE_CUSTOM_COLUMN_SORT) || '{}',
    )[tableId];
  };

  const computedColumnSort = computed(() => {
    const grid = getGrid();
    const tableId = grid?.id;
    if (!tableId) {
      return null;
    }
    if (grid?.customConfig?.storage !== true) {
      return null;
    }
    return getColumnSortConfig(tableId as string);
  });

  return {
    computedColumnSort,
    setColumnSortConfig,
  };
};
