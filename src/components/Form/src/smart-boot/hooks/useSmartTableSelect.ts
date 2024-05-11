import type { SmartTableProps } from '@/components/SmartTable';
import { useSmartTable } from '@/components/SmartTable';
import type { ComputedRef, Ref } from 'vue';
import { computed, ref, unref, watch } from 'vue';
import { remove } from 'lodash-es';

export const useSmartTableSelect = (
  tablePropsRef: Ref<SmartTableProps>,
  selectTablePropsRef: Ref<SmartTableProps | undefined>,
  showSelect: boolean,
  valueFieldRef: Ref<string>,
  selectValuesRef: Ref<Array<any>>,
  hasTableSlot: ComputedRef<boolean>,
  listApi: ((data: any) => Promise<any>) | undefined,
  alwaysLoad: Ref<boolean>,
  multiple: Ref<boolean>,
) => {
  const getTableProps = computed<SmartTableProps>(() => {
    const tableProps = unref(tablePropsRef);
    if (unref(alwaysLoad) && tableProps.proxyConfig) {
      tableProps.proxyConfig.autoLoad = false;
    }
    const isMultiple = unref(multiple);
    // const checkboxConfig = multiple
    //   ? {
    //       checkboxConfig: {
    //         rowTrigger: 'multiple',
    //         highlight: true,
    //       },
    //     }
    //   : {};
    return {
      // ...checkboxConfig,
      ...tableProps,
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
        ...(tableProps.columns || []),
      ],
      rowConfig: {
        keyField: unref(valueFieldRef),
      },
    };
  });
  /**
   * 是否有搜索表单
   */
  const getHasSearchForm = computed(() => {
    return unref(tablePropsRef).useSearchForm;
  });

  const getTableCheckboxConfig = computed(() => {
    return {
      highlight: true,
      rowTrigger: 'multiple',
      checkRowKeys: unref(selectValuesRef),
    };
  });

  /**
   * 获取单选配置
   */
  const getTableRadioConfig = computed(() => {
    const result: Recordable = {
      highlight: true,
      strict: false,
      // reserve: true,
      trigger: 'row',
    };
    const selectValues = unref(selectValuesRef);
    if (selectValues && selectValues.length > 0) {
      result.checkRowKey = selectValues[0];
    }
    return result;
  });

  watch(selectValuesRef, async () => {
    selectRowsRef.value = await getSelectRows();
    if (!unref(hasTableSlot)) {
      handleSetSelect();
    }
  });

  const handleSetSelect = async () => {
    if (unref(multiple)) {
      await handleSetSelectRows();
    } else {
      await handleSetRadioRow();
    }
  };

  const handleSetSelectRows = async () => {
    getTableInstance()?.setAllCheckboxRow(false);
    setCheckboxRow(unref(selectRowsRef), true);
  };

  const handleSetRadioRow = () => {
    const selectRows = unref(selectRowsRef);
    getTableInstance()?.clearRadioRow();
    if (selectRows && selectRows.length > 0) {
      getTableInstance()?.setRadioRow(selectRows[0]);
    }
  };

  /**
   * 获取选中的数据
   */
  const getSelectRows = async () => {
    const selectValues = unref(selectValuesRef);
    if (!selectValues || selectValues.length === 0) {
      return [];
    }
    const valueField = unref(valueFieldRef);
    let tableData: any[] = [];
    try {
      tableData = getData();
    } catch (e) {
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
      const matchKeyList = matchDataList.map((item) => item[valueField]);
      noDataValue = selectValues.filter((item) => !matchKeyList.includes(item));
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
        const matchKeyList2 = matchDataList.map((item) => item[valueField]);
        noDataValue = noDataValue.filter((item) => !matchKeyList2.includes(item));
      }
    }
    if (noDataValue.length > 0) {
      // 通过API查询
      const result = await listApi!(noDataValue);
      matchDataList.push(...result);
    }
    return matchDataList;
  };

  const [
    registerTable,
    { setCheckboxRow, getCheckboxRecords, getData, getTableInstance, query, getSearchForm },
  ] = useSmartTable(unref(getTableProps));
  const [registerSelectTable, { setPagination }] = useSmartTable(unref(selectTablePropsRef) || {});

  const selectRowsRef = ref<any[]>([]);

  /**
   * 设置选中的数据
   * @param dataList
   */
  const setSelectData = (dataList: any[]) => {
    selectRowsRef.value = dataList;
  };

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
    const valueField = unref(valueFieldRef);
    remove(selectRows, (item) => {
      return dataList.some((current) => current[valueField] === item[valueField]);
    });
  };
  /**
   * 获取选中的数据
   */
  const getSelectData = () => unref(selectRowsRef);

  const handleCheckboxChange = ({ checked, row }) => {
    const selectRows = unref(selectRowsRef);
    if (checked) {
      addSelectData([row]);
    } else {
      removeSelectData([row]);
    }
    if (showSelect) {
      setPagination({
        total: selectRows.length,
      });
    }
  };

  /**
   * 单选触发
   */
  const handleRadioChange = ({ row, newValue }) => {
    setSelectData([]);
    if (newValue) {
      addSelectData([row]);
    }
  };

  const handleCheckboxAll = ({ checked }) => {
    const currentDataList = getData();
    if (!currentDataList || currentDataList.length === 0) {
      return;
    }
    if (checked) {
      const keyList = unref(selectRowsRef).map((item) => item[unref(valueFieldRef)]);
      addSelectData(
        currentDataList.filter((item) => !keyList.includes(item[unref(valueFieldRef)])),
      );
    } else {
      removeSelectData(currentDataList);
    }
  };

  const handleModalOk = () => {
    selectRowsRef.value = getCheckboxRecords() || [];
  };

  return {
    registerTable,
    handleCheckboxChange,
    registerSelectTable,
    selectRowsRef,
    setSelectData,
    addSelectData,
    getSelectData,
    removeSelectData,
    getTableCheckboxConfig,
    handleCheckboxAll,
    getData,
    getHasSearchForm,
    query,
    getTableRadioConfig,
    handleRadioChange,
    handleSetSelect,
    getSearchForm,
    handleModalOk,
  };
};
