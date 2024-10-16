import type { SmartTableProps } from '@/components/SmartTable';
import type { VxeGridDefines, VxeGridInstance } from 'vxe-table';

import type { SmartTableRenderProps } from '../types';

import { computed, unref } from 'vue';

import { isBoolean } from '@vben-core/shared/utils';

import { defaultCheckboxConfig } from '../defaultConfig';

/**
 * check box 功能完善
 * @param tableProps
 * @param emit
 * @param getTableInstance
 */
export const useSmartTableCheckbox = (
  tableProps: SmartTableRenderProps,
  emit: (name: string, args?: any) => void,
  getTableInstance: () => VxeGridInstance,
) => {
  let lastRowIndex: null | number = null;

  /**
   * 单元格被点击事件
   */
  const handleCellClick = async (
    params: VxeGridDefines.CellClickEventParams,
    rowShift: boolean | undefined,
    rowCtrl: boolean | undefined,
  ) => {
    emit('cellClick', params);

    const gridInstance = getTableInstance();
    const { $event, row, rowIndex } = params;
    const { ctrlKey, shiftKey } = $event as PointerEvent;
    if (rowCtrl && ctrlKey) {
      // 点击了ctrl
      gridInstance.toggleCheckboxRow(row);
    } else {
      gridInstance.clearCheckboxRow();
      gridInstance.setCheckboxRow(row, true);
    }
    if (rowShift && shiftKey) {
      if (lastRowIndex === null) {
        lastRowIndex = rowIndex;
      } else {
        // 第二次shift点击
        const tableData = gridInstance.getData();
        const indexList = [lastRowIndex, rowIndex];
        indexList.sort((a, b) => a - b);
        const checkboxList: any[] = [];
        for (const [i, tableDatum] of tableData.entries()) {
          if (i >= indexList[0] && i <= indexList[1]) {
            checkboxList.push(tableDatum);
          }
        }
        gridInstance.clearCheckboxRow();
        gridInstance.setCheckboxRow(checkboxList, true);
      }
    } else {
      lastRowIndex = null;
    }
  };

  const computeCheckboxTableProps = computed<SmartTableProps>(() => {
    const propCheckboxConfig = unref(tableProps).checkboxConfig;
    if (!propCheckboxConfig) {
      return undefined;
    }
    const checkboxConfig = isBoolean(propCheckboxConfig)
      ? defaultCheckboxConfig
      : propCheckboxConfig;
    const { rowCtrl, rowShift, rowTrigger } = checkboxConfig;
    if (!rowTrigger) {
      return {
        onCellClick: (params: VxeGridDefines.CellClickEventParams) =>
          emit('cellClick', params),
      };
    }
    if (rowTrigger === 'multiple') {
      return {
        checkboxConfig: {
          ...checkboxConfig,
          trigger: 'row',
        },
        onCellClick: (params: VxeGridDefines.CellClickEventParams) =>
          emit('cellClick', params),
      };
    }
    return {
      checkboxConfig: {
        ...checkboxConfig,
      },
      onCellClick: (params: VxeGridDefines.CellClickEventParams) =>
        handleCellClick(params, rowShift, rowCtrl),
    };
  });

  return {
    computeCheckboxTableProps,
  };
};
