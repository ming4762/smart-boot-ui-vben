import type { ExtendSmartTableApi, SmartTableProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';
import type { ComputedRef } from 'vue';

import type { SmartTableSelectModalProps } from '../../type';

import { useSmartTable } from '#/adapter/smart-table';
import { remove } from '@vben/utils';
import { computed, h, ref, unref, watch } from 'vue';

type Function = () => any;

const useSmartTableSelect = (
  props: SmartTableSelectModalProps,
  hasTableSlot: ComputedRef<boolean>,
) => {
  const selectRowsRef = ref<any[]>([]);

  const computedSelectValues = computed(() => unref(props).selectValues);

  let slotRegisterFunction: Recordable<Function> = {};
  const registerSlotFunction = (functions: Recordable<Function>) => {
    slotRegisterFunction = functions;
  };

  const computedTableProps = computed<SmartTableProps>(() => {
    const tableProps = unref(props).tableProps;
    let autoLoad = tableProps.proxyConfig?.autoLoad;
    if (unref(props).alwaysLoad && tableProps.proxyConfig) {
      autoLoad = false;
    }
    const isMultiple = unref(props.multiple);
    return {
      ...tableProps,
      proxyConfig: {
        ...tableProps.proxyConfig,
        autoLoad,
      },
      columns: [
        isMultiple
          ? {
              type: 'checkbox',
              width: 60,
              align: 'center',
              fixed: 'left',
            }
          : {
              type: 'radio',
              width: 60,
              align: 'center',
              fixed: 'left',
            },
        ...(unref(tableProps).columns || []),
      ],
      rowConfig: {
        keyField: unref(props.valueField),
      },
    };
  });

  /**
   * 是否有搜索表单
   */
  const getHasSearchForm = computed(() => {
    return unref(props).tableProps.useSearchForm;
  });

  const getTableCheckboxConfig = computed(() => {
    return {
      highlight: true,
      rowTrigger: 'multiple',
      checkRowKeys: unref(props).selectValues,
    };
  });

  /**
   * 获取单选配置
   */
  const getTableRadioConfig = computed(() => {
    const result: Recordable<any> = {
      highlight: true,
      strict: false,
      // reserve: true,
      trigger: 'row',
    };
    const selectValues = unref(props).selectValues;
    if (selectValues && selectValues.length > 0) {
      result.checkRowKey = selectValues[0];
    }
    return result;
  });

  const [SmartTable, tableApi] = useSmartTable({});
  let SelectSmartTable: any = null;
  let selectTableApi: ExtendSmartTableApi | null = null;

  if (unref(props).showSelect) {
    const useSmartTableSelect = useSmartTable(
      unref(props).selectTableProps || {},
    );
    SelectSmartTable = useSmartTableSelect[0];
    selectTableApi = useSmartTableSelect[1];
  }

  /**
   * 获取选中的数据
   */
  const getSelectRows = async () => {
    const selectValues = unref(computedSelectValues);
    if (!selectValues || selectValues.length === 0) {
      return [];
    }
    const valueField = unref(props).valueField;
    let tableData: any[] = [];
    try {
      tableData = tableApi.getGrid().getData();
    } catch {
      // do nothing
    }
    // 没有匹配上的数据
    let noDataValue: any[] = [];
    const matchDataList: any[] = [];
    if (tableData) {
      tableData.forEach((item) => {
        const key = item[valueField];
        if (selectValues.includes(key)) {
          matchDataList.push(item);
        }
      });
      const matchKeyList = new Set(
        matchDataList.map((item) => item[valueField]),
      );
      noDataValue = selectValues.filter((item) => !matchKeyList.has(item));
    }
    if (noDataValue.length > 0) {
      // 没有匹配的数据
      // 1、从已经选中的数据中查找
      const selectRows = unref(selectRowsRef);
      if (selectRows.length > 0) {
        selectRows.forEach((item) => {
          if (noDataValue.includes(item[valueField])) {
            matchDataList.push(item);
          }
        });
        const matchKeyList2 = new Set(
          matchDataList.map((item) => item[valueField]),
        );
        noDataValue = noDataValue.filter((item) => !matchKeyList2.has(item));
      }
    }
    if (noDataValue.length > 0) {
      // 通过API查询
      const result = await props.listApi(noDataValue);
      matchDataList.push(...result);
    }
    return matchDataList;
  };

  const handleSetSelectRows = () => {
    const grid = tableApi.getGrid();
    grid?.setAllCheckboxRow(false);
    grid?.setCheckboxRow(unref(selectRowsRef), true);
  };

  const handleSetRadioRow = () => {
    const selectRows = unref(selectRowsRef);
    const grid = tableApi.getGrid();
    if (!grid) {
      return;
    }
    grid.clearRadioRow();
    if (selectRows && selectRows.length > 0) {
      grid.setRadioRow(selectRows[0]);
    }
  };

  const handleSetSelect = async () => {
    await (unref(props).multiple ? handleSetSelectRows() : handleSetRadioRow());
  };

  watch(computedSelectValues, async () => {
    selectRowsRef.value = await getSelectRows();
    if (!unref(hasTableSlot)) {
      handleSetSelect();
    }
  });

  /**
   * 添加选中的数据
   * @param dataList
   */
  const addSelectData = (dataList: any[]) => {
    const selectRows = unref(selectRowsRef);
    selectRows.push(...dataList);
  };

  /**
   * 移除数据
   * @param dataList
   */
  const removeSelectData = (dataList: any[]) => {
    const selectRows = unref(selectRowsRef);
    const valueField = unref(props).valueField;
    remove(selectRows, (item) => {
      return dataList.some(
        (current) => current[valueField] === item[valueField],
      );
    });
  };

  const handleCheckboxChange = ({ checked, row }: any) => {
    const selectRows = unref(selectRowsRef);
    if (checked) {
      addSelectData([row]);
    } else {
      removeSelectData([row]);
    }
    if (unref(props).showSelect) {
      selectTableApi?.setPagerConfig({
        total: selectRows.length,
      });
    }
  };
  ``;

  const handleCheckboxAll = ({ checked }: any) => {
    const currentDataList = tableApi.getGrid().getData();
    if (!currentDataList || currentDataList.length === 0) {
      return;
    }
    const valueField = unref(props).valueField;
    if (checked) {
      const keyList = new Set(
        unref(selectRowsRef).map((item) => item[valueField]),
      );
      addSelectData(
        currentDataList.filter((item) => !keyList.has(item[valueField])),
      );
    } else {
      removeSelectData(currentDataList);
    }
  };
  /**
   * 设置选中的数据
   * @param dataList
   */
  const setSelectData = (dataList: any[]) => {
    selectRowsRef.value = dataList;
  };

  /**
   * 表格插槽绑定值
   */
  const computedTableSlotBindValues = computed(() => {
    return {
      setSelectData,
      addSelectData,
      removeSelectData,
      selectData: unref(selectRowsRef),
      registerHandler: registerSlotFunction,
    };
  });

  const RenderTable = () => {
    const multiple = unref(props).multiple;
    const tableAttrs: any = {
      onCheckboxChange: handleCheckboxChange,
      onCheckboxAll: handleCheckboxAll,
      ...unref(computedTableProps),
    };
    if (multiple) {
      tableAttrs.checkboxConfig = unref(getTableCheckboxConfig);
    } else {
      tableAttrs.radioConfig = unref(getTableRadioConfig);
    }
    return h(SmartTable, tableAttrs);
  };

  /**
   * 渲染选中表格
   * @constructor
   */
  const RenderSelectTable = () => {
    if (!SelectSmartTable) {
      return null;
    }
    return h(SelectSmartTable, {
      data: unref(selectRowsRef),
    });
  };

  const handleModalOk = () => {
    selectRowsRef.value = slotRegisterFunction.getData
      ? slotRegisterFunction.getData() || []
      : tableApi.getGrid().getCheckboxRecords() || [];
  };

  return {
    RenderTable,
    setSelectData,
    addSelectData,
    removeSelectData,
    selectRowsRef,
    computedTableSlotBindValues,
    RenderSelectTable,
    getHasSearchForm,
    handleModalOk,
  };
};

export { useSmartTableSelect };
