<script setup lang="tsx">
import type { VxeGridInstance, VxeGridProps } from 'vxe-table';

import type {
  SmartTableActions,
  SmartTableRenderListeners,
  SmartTableRenderProps,
} from '../types';
import type { SmartTableInnerActionType } from '../types/SmartTableActionType';

import { computed, onMounted, ref, unref, useSlots, useTemplateRef } from 'vue';

import { buildUUID } from '@vben-core/shared/utils';

import { VxeGrid, VxeUI } from 'vxe-table';

import TableSearchLayout from '../components/TableSearchLayout.vue';
import { useSmartTableAjax } from '../hooks/useSmartTableAjax';
import { useSmartTableCheckbox } from '../hooks/useSmartTableCheckbox';
import { useSmartTableColumn } from '../hooks/useSmartTableColumn';
import { useSmartTableLoading } from '../hooks/useSmartTableLoading';
import { useSmartTableModalAddEditEdit } from '../hooks/useSmartTableModalAddEdit';
import { useSmartTablePagerConfig } from '../hooks/useSmartTablePager';
import { useSmartTableSearchForm } from '../hooks/useSmartTableSearchForm';
import { useSmartTableToolbar } from '../hooks/useSmartTableToolbar';
import { createSmartTableContext } from '../types/useSmartTableContext';

interface Props extends SmartTableRenderProps {}

const props = withDefaults(defineProps<Props>(), {
  column: [],
  hasPermission: (_) => false,
  id: buildUUID(),
  size: () => 'tiny',
});

const emit = defineEmits<SmartTableRenderListeners>();

const slots = useSlots();

// @ts-ignore
const emitHandler = (code: string, ...args: any[]) => emit(code, args);

const t = VxeUI.getI18n;

// table 外层 ref
const wrapRef = useTemplateRef<HTMLElement>('wrapRef');

/**
 * vxe-grid对象实例
 */
const vxeTableInstance = ref<VxeGridInstance>();
const getVxeTableInstance = () => unref(vxeTableInstance);

const { getLoading, setLoading } = useSmartTableLoading(props);

// 列调整
const { computedTableColumns } = useSmartTableColumn(props, t);
// 分页
const { computedPagerConfig } = useSmartTablePagerConfig(props);
// 复选框
const { computeCheckboxTableProps } = useSmartTableCheckbox(
  props,
  emitHandler,
  getVxeTableInstance,
);
// 搜索表单
const { getSearchFormParameter, SearchForm, searchFormApi } =
  useSmartTableSearchForm(props, emitHandler, t);

/**
 * ajax增强
 */
const { computedProxyConfig, deleteByCheckbox, query } = useSmartTableAjax(
  props,
  emitHandler,
  t,
  {
    getSearchFormParameter,
  },
);

const {
  AddEditModal,
  computedHasAddEdit,
  editByCheckbox,
  editByRowModal,
  showAddModal,
} = useSmartTableModalAddEditEdit(props, emitHandler, t);

const { computedToolbarConfig } = useSmartTableToolbar(props, t);

/**
 * 表格计算属性
 */
const computedTableProps = computed<VxeGridProps>(() => {
  return {
    ...props,
    columns: unref(computedTableColumns),
    pagerConfig: unref(computedPagerConfig),
    ...unref(computeCheckboxTableProps),
    loading: unref(getLoading),
    proxyConfig: unref(computedProxyConfig),
    toolbarConfig: unref(computedToolbarConfig),
  } as VxeGridProps;
});

const computedTableSlots = computed(() => {
  return {
    ...slots,
  };
});

const tableAction: SmartTableActions = {
  deleteByCheckbox: () => deleteByCheckbox(),
  editByCheckbox: () => editByCheckbox(),
  editByRowModal: (row, formData) => editByRowModal(row, formData),
  getAddEditForm: () => ({}),
  getGrid: () => getVxeTableInstance()!,
  getSearchForm: () => searchFormApi,
  query: (params) => query(params),
  setLoading: (loading: boolean) => setLoading(loading),
  showAddModal: (selectData, formData) => showAddModal(selectData, formData),
};

const tableInnerAction: SmartTableInnerActionType = {
  hasPermission: props.hasPermission,
};

createSmartTableContext({
  ...tableAction,
  getBindValues: computedTableProps,
  t,
  tableInnerAction,
  wrapRef,
});

/**
 * 渲染表格
 */
const renderTable = () => {
  const vNodeList = [
    <VxeGrid ref={vxeTableInstance} {...unref(computedTableProps)}>
      {{ ...unref(computedTableSlots) }}
    </VxeGrid>,
  ];
  if (unref(computedHasAddEdit)) {
    vNodeList.push(<AddEditModal />);
  }
  return vNodeList;
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
  return (
    <TableSearchLayout class="smart-table" ref="wrapRef">
      {slots}
    </TableSearchLayout>
  );
};

onMounted(() => {
  emit('register', tableAction);
});
</script>

<template>
  <RenderFunction />
</template>

<style lang="less" scoped></style>
