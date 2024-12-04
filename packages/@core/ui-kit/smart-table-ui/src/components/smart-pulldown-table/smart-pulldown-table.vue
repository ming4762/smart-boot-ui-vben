<script setup lang="ts">
import type { Recordable } from '@vben-core/typings';
import type { VxeGridInstance, VxePulldownInstance } from 'vxe-table';

import type { SmartTableRenderProps } from '../../types';
import type {
  SmartPulldownTableEvent,
  SmartPulldownTableProps,
} from '../../types/SmartPulldownTable';

import {
  computed,
  h,
  nextTick,
  ref,
  unref,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue';

import { useRuleFormItem } from '@vben-core/composables';
import { createIconifyIcon } from '@vben-core/icons';

import { VxePulldown } from 'vxe-pc-ui';

import { useSmartTable } from '../../use-smart-table';
import { getComponent } from '../../utils';

interface Props extends SmartPulldownTableProps {}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  allowClear: true,
  alwaysLoad: false,
  dropdownWidth: 600,
  immediate: true,
  searchIgnoreCase: true,
  showSearch: true,
});
const emit = defineEmits<SmartPulldownTableEvent>();

const attrs = useAttrs();

const pulldownRef = useTemplateRef<VxePulldownInstance>('pulldownRef');

const dataLoadingRef = ref<boolean>(false);
const tableDataRef = ref<Recordable<any>[]>([]);
const searchValueRef = ref<string>('');
// 是否初始化加载
const initLoad = ref<boolean>(false);
/**
 * 下拉框是否显示
 */
const isVisibleRef = ref(false);
// 选中的行
const selectRowRef = ref<null | Recordable<any> | undefined>(null);

const [SmartTable, tableApi] = useSmartTable({});

const filterOptionFunction =
  props.filterOption ??
  ((searchValue: string, row: Recordable<any>) => {
    if (!searchValue || searchValue.trim().length === 0) {
      return true;
    }
    const searchValueTrim = searchValue.trim();
    let showValue = '';
    if (props.showFunction) {
      showValue = props.showFunction(row);
    } else if (props.showField) {
      showValue = row[props.showField];
    }
    if (
      (props.searchIgnoreCase ? showValue.toUpperCase() : showValue).includes(
        searchValueTrim,
      )
    ) {
      return true;
    }
    const fieldValue: string = row[props.valueField].toString();
    return (
      props.searchIgnoreCase ? fieldValue.toUpperCase() : fieldValue
    ).includes(searchValueTrim);
  });

const computeTableData = computed(() => {
  const tableData = unref(tableDataRef);
  if (tableData.length === 0) {
    return tableData;
  }
  const searchValue = unref(searchValueRef);
  if (!searchValue) {
    return tableData;
  }
  return tableData.filter((item: any) =>
    filterOptionFunction(
      props.searchIgnoreCase ? searchValue.toUpperCase() : searchValue,
      item,
    ),
  );
});

const computedSelectRowValue = computed(() => {
  const showFieldValue = props.showField;
  if (!props.showFunction && !showFieldValue) {
    throw new Error('未设置showField或showFunction');
  }
  const selectRow = unref(selectRowRef);
  if (!selectRow) {
    return null;
  }
  if (props.showFunction) {
    return props.showFunction(selectRow);
  }
  return selectRow[showFieldValue!];
});

/**
 * 加载表格数据函数
 */
const loadTableData = async () => {
  if (props.api) {
    try {
      dataLoadingRef.value = true;
      tableDataRef.value = await props.api();
    } finally {
      dataLoadingRef.value = false;
    }
  }
};

const emitData = ref<Recordable<any>[]>([]);
const [state] = useRuleFormItem(props, 'value', 'change', emitData);
watch(
  () => state.value,
  (v) => {
    emit('update:value', v);
  },
);

/**
 * 下拉容器样式
 */
const computedDropdownContainerStyle = computed(() => {
  const style: Recordable<any> = {
    width: `${props.dropdownWidth}px`,
  };
  const height = props.height;
  if (height) {
    style.height = `${height}px`;
  }
  return style;
});

/**
 * 设置当前行
 */
const setCurrentRow = () => {
  nextTick(() => {
    const tableInstance: VxeGridInstance = tableApi.getGrid?.();
    if (!tableInstance) {
      return;
    }
    const row = unref(selectRowRef);
    if (row) {
      tableInstance.setCurrentRow(row);
    } else {
      tableInstance.clearCurrentRow();
    }
  });
};

watch([() => props.value], ([value]) => {
  let row: null | Recordable<any> | undefined = null;
  if (value) {
    const selectRows = unref(tableDataRef).filter(
      (item) => item[props.valueField].toString() === value.toString(),
    );
    if (selectRows.length > 0) {
      row = selectRows[0];
    }
  }
  selectRowRef.value = row;
  setCurrentRow();
});

/**
 * 显示弹窗
 */
const handleShow = async () => {
  isVisibleRef.value = true;
  unref(pulldownRef)?.showPanel();
  if (props.alwaysLoad || !unref(initLoad)) {
    await loadTableData();
    // 初始化加载
    if (!unref(initLoad)) {
      initLoad.value = true;
    }
  }
  emit('visibleChange', true);
  setCurrentRow();
};

const handleHide = () => {
  isVisibleRef.value = false;
  searchValueRef.value = '';
  emit('visibleChange', false);
};

const changeValue = (row?: Recordable<any>) => {
  emit('select', row);
  state.value = row?.[props.valueField];
};

const dropdownTableProps: SmartTableRenderProps = {
  size: 'mini',
  ...props.tableProps,
  onCellClick: ({ row }: any) => {
    changeValue(row);
    unref(pulldownRef)?.hidePanel();
    handleHide();
  },
  rowConfig: {
    ...props.tableProps?.rowConfig,
    isCurrent: true,
  },
};

/**
 * 搜索框变化触发
 * @param value
 */
const handleSearchChange = (value: string) => {
  searchValueRef.value = value;
  setCurrentRow();
};

const handleUpdateValue = () => {
  changeValue();
  handleShow();
};

const computedPulldownProps = computed(() => {
  return {
    ...props.pulldownProps,
    transfer: true,
  };
});

const RenderSelect = () => {
  const SelectComponent = getComponent('Select');
  if (!SelectComponent) {
    return null;
  }
  return h(SelectComponent, {
    ...attrs,
    allowClear: props.allowClear,
    class: 'smart-pulldown-select',
    onFocus: handleShow,
    onSearch: handleSearchChange,
    'onUpdate:value': handleUpdateValue,
    open: false,
    searchValue: unref(searchValueRef),
    showSearch: props.showSearch,
    value: unref(computedSelectRowValue),
  });
};

const RenderIcon = createIconifyIcon('ant-design:table-outlined');
</script>

<template>
  <VxePulldown
    ref="pulldownRef"
    v-bind="computedPulldownProps"
    class-name="smart-pullown-container"
    popup-class-name="smart-pullown-table"
    @hide-panel="handleHide"
  >
    <div
      :class="isVisibleRef ? 'smart-pulldown-open' : ''"
      class="smart-pulldown-select-container"
    >
      <div class="select">
        <RenderSelect />
      </div>
      <div class="suffix-icon">
        <span class="anticon" @click="handleShow">
          <RenderIcon />
        </span>
      </div>
    </div>
    <template #dropdown>
      <div :style="computedDropdownContainerStyle">
        <SmartTable :data="computeTableData" v-bind="dropdownTableProps" />
      </div>
    </template>
  </VxePulldown>
</template>

<style lang="less">
@suffix-icon-width: 30px;

.smart-pullown-table {
  .smart-table-container {
    padding: 0;
  }

  .vxe-pulldown--panel-wrapper {
    box-shadow:
      0 6px 16px 0 rgb(0 0 0 / 8%),
      0 3px 6px -4px rgb(0 0 0 / 12%),
      0 9px 28px 8px rgb(0 0 0 / 5%);
  }

  .ant-input-group-addon {
    cursor: pointer;
  }
}

.smart-pullown-container {
  width: 100%;

  .smart-pulldown-select-container {
    display: flex;
    .smart-pulldown-select {
      width: 100%;
    }
  }

  .select {
    width: calc(100% - @suffix-icon-width);
  }

  .suffix-icon {
    width: @suffix-icon-width;
    border: 1px solid #d9d9d9;
    border-left: 0;
    border-radius: 0 4px 4px 0;
    background-color: rgb(0 0 0 / 2%);
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ant-select-selector {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .smart-pulldown-open {
    .ant-select-selection-item {
      color: rgb(0 0 0 / 25%);
    }
  }
}
</style>
