<script setup lang="tsx">
import type { VxeGridInstance, VxeGridProps } from 'vxe-table';

import type {
  SmartTableRenderListeners,
  SmartTableRenderProps,
} from '../types';

import { computed, ref, unref } from 'vue';

import { buildUUID } from '@vben-core/shared/utils';

import { VxeGrid, VxeUI } from 'vxe-table';

import TableSearchLayout from '../components/TableSearchLayout.vue';
import { useSmartTableCheckbox } from '../hooks/useSmartTableCheckbox';
import { useSmartTableColumn } from '../hooks/useSmartTableColumn';
import { useSmartTablePagerConfig } from '../hooks/useSmartTablePager';
import { useSmartTableSearchForm } from '../hooks/useSmartTableSearchForm';

interface Props extends SmartTableRenderProps {}

const props = withDefaults(defineProps<Props>(), {
  column: [],
  id: buildUUID(),
  size: 'small',
});

const emit = defineEmits<SmartTableRenderListeners>();
/**
 * vxe-grid对象实例
 */
const vxeTableInstance = ref<VxeGridInstance>();
const getVxeTableInstance = () => unref(vxeTableInstance);

// 列调整
const { computedTableColumns } = useSmartTableColumn(props, VxeUI.getI18n);
// 分页
const { computedPagerConfig } = useSmartTablePagerConfig(props);
// 复选框
const { computeCheckboxTableProps } = useSmartTableCheckbox(
  props,
  emit,
  getVxeTableInstance,
);
// 搜索表单
const { SearchForm } = useSmartTableSearchForm(props);

/**
 * 表格计算属性
 */
const computedTableProps = computed<VxeGridProps>(() => {
  return {
    ...props,
    columns: unref(computedTableColumns),
    pagerConfig: unref(computedPagerConfig),
    ...unref(computeCheckboxTableProps),
  } as VxeGridProps;
});

/**
 * 渲染表格
 */
const renderTable = () => {
  return [
    <VxeGrid ref={vxeTableInstance} {...unref(computedTableProps)}></VxeGrid>,
  ];
};

/**
 * 渲染搜索表单
 */
const renderSearchForm = () => {
  return [<SearchForm></SearchForm>];
};

/**
 * 渲染函数
 * @constructor
 */
const RenderFunction = () => {
  const slots: any = {
    table: renderTable,
  };
  if (props.useSearchForm) {
    slots.search = renderSearchForm;
  }
  return <TableSearchLayout class="smart-table">{slots}</TableSearchLayout>;
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped></style>
