import type {
  VxeGridDefines,
  VxeGridInstance,
  VxeTableDefines,
} from 'vxe-table';

import type { SmartTableRenderProps } from '../types';

import { computed, type ComputedRef, unref } from 'vue';

import { isBoolean } from '@vben-core/shared/utils';

import { defaultCheckboxConfig } from '../defaultConfig';

/**
 * check box 功能完善
 * @param tableProps
 * @param emit
 * @param getTableInstance
 */
export const useSmartTableCheckbox = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  emit: (name: string, ...args: any) => void,
  getTableInstance: () => undefined | VxeGridInstance,
) => {
  let lastRowIndex: null | number = null;

  /**
   * 单元格被点击事件
   */
  const handleCellClick = async (
    params: VxeTableDefines.CellClickEventParams,
    rowShift: boolean | undefined,
    rowCtrl: boolean | undefined,
  ) => {
    emit('cellClick', params);

    const gridInstance = getTableInstance();
    if (!gridInstance) {
      return;
    }
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
          if (i >= (indexList[0] as number) && i <= (indexList[1] as number)) {
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

  const computeCheckboxTableProps = computed(() => {
    const propCheckboxConfig = unref(tableProps).checkboxConfig;
    if (!propCheckboxConfig) {
      return {
        checkboxConfig: undefined,
      };
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
      onCellClick: (params: VxeTableDefines.CellClickEventParams) =>
        handleCellClick(params, rowShift, rowCtrl),
    } as Partial<SmartTableRenderProps>;
  });

  return {
    computeCheckboxTableProps,
  };
};
