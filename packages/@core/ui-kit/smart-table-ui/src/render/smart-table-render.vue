<script setup lang="tsx">
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridPropTypes,
} from 'vxe-table';

import type {
  SmartTableAction,
  SmartTableColumn,
  SmartTableRenderListeners,
  SmartTableRenderProps,
} from '../types';
import type { SmartTableInnerActionType } from '../types/SmartTableActionType';
import type { SmartTableInnerContext } from '../types/SmartTableInnerType';

import {
  computed,
  onMounted,
  ref,
  unref,
  useAttrs,
  useSlots,
  useTemplateRef,
} from 'vue';

import { buildUUID } from '@vben-core/shared/utils';

import { VxeGrid, VxeUI } from 'vxe-table';

import TableSearchLayout from '../components/TableSearchLayout.vue';
import { useSmartTableAjax } from '../hooks/useSmartTableAjax';
import { useSmartTableCheckbox } from '../hooks/useSmartTableCheckbox';
import { useSmartTableColumn } from '../hooks/useSmartTableColumn';
import { useSmartTableColumnConfig } from '../hooks/useSmartTableColumnConfig';
import { useSmartTableLoading } from '../hooks/useSmartTableLoading';
import { useSmartTableModalAddEditEdit } from '../hooks/useSmartTableModalAddEdit';
import { useSmartTablePagerConfig } from '../hooks/useSmartTablePager';
import { useSmartTableSearchForm } from '../hooks/useSmartTableSearchForm';
import { useSmartTableToolbar } from '../hooks/useSmartTableToolbar';
import { createSmartTableContext } from '../types/useSmartTableContext';

interface Props extends SmartTableRenderProps {}

const props = withDefaults(defineProps<Props>(), {
  column: [],
  hasPermission: (_: string | string[]) => false,
  id: buildUUID(),
  size: () => 'small',
});
const emit = defineEmits<SmartTableRenderListeners>();
const slots = useSlots();
const attrs = useAttrs();

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

const innerPropsRef = ref<Partial<SmartTableRenderProps>>();
const computedTableProps = computed(() => {
  return {
    ...props,
    ...unref(innerPropsRef),
  };
});
const setSmartTableProps = (setProps: Partial<SmartTableRenderProps>) => {
  innerPropsRef.value = { ...unref(innerPropsRef), ...setProps };
};

/**
 * 列排序存储
 */
const { computedColumnSort, setColumnSortConfig } =
  useSmartTableColumnConfig(getVxeTableInstance);

/**
 * 表格加载状态
 */
const { getLoading, setLoading } = useSmartTableLoading(computedTableProps);

// 列调整
const { computedTableColumns } = useSmartTableColumn(computedTableProps, t);
// 分页
const { computedPagerConfig } = useSmartTablePagerConfig(computedTableProps);
// 复选框
const { computeCheckboxTableProps } = useSmartTableCheckbox(
  computedTableProps,
  emitHandler,
  getVxeTableInstance,
);
// 搜索表单
const {
  computedSearchFormVisible,
  getSearchFormParameter,
  SearchForm,
  searchFormApi,
} = useSmartTableSearchForm(computedTableProps, emitHandler, t);

/**
 * ajax增强
 */
const {
  computedProxyConfig,
  deleteByCheckbox,
  deleteByRow,
  query,
  setUseYnByCheckbox,
  setUseYnByRow,
} = useSmartTableAjax(computedTableProps, emitHandler, t, {
  getSearchFormParameter,
});

const {
  AddEditModal,
  computedHasAddEdit,
  editByCheckbox,
  editByRowModal,
  getAddEditForm,
  showAddModal,
} = useSmartTableModalAddEditEdit(computedTableProps, emitHandler, t);

const { computedToolbarConfig } = useSmartTableToolbar(computedTableProps, t);

/**
 * 表格计算属性
 */
const getSmartTableBindValues = computed<VxeGridProps>(() => {
  return {
    ...attrs,
    ...unref(computedTableProps),
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

const getTableColumns = computed<SmartTableColumn[]>(() => {
  const columns = [...unref(computedTableColumns)];
  const columnSort = unref(computedColumnSort);
  if (!columnSort) {
    return columns;
  }
  return columns.sort((a, b) => {
    if (!a.field) {
      return 0;
    }
    if (!columnSort.includes(a.field)) {
      return 0;
    }
    return columnSort.indexOf(a.field) - columnSort.indexOf(b.field);
  });
});

const tableAction: SmartTableAction = {
  deleteByCheckbox: () => deleteByCheckbox(),
  deleteByRow: (row) => deleteByRow(row),
  editByCheckbox: () => editByCheckbox(),
  editByRowModal: (row, formData) => editByRowModal(row, formData),
  getAddEditForm: () => getAddEditForm(),
  getGrid: () => getVxeTableInstance()!,
  getSearchForm: () => searchFormApi,
  query: (params) => query(params),
  setLoading: (loading: boolean) => setLoading(loading),
  setUseYnByCheckbox,
  setUseYnByRow,
  showAddModal: (selectData, formData) => showAddModal(selectData, formData),
};

const tableInnerAction: SmartTableInnerActionType = {
  hasPermission: props.hasPermission,
  setColumnSortConfig: () => setColumnSortConfig(),
  setSmartTableProps,
};

const tableInnerContext: SmartTableInnerContext = {
  computedSearchFormVisible,
};

createSmartTableContext({
  ...tableAction,
  getBindValues: computedTableProps,
  t,
  tableInnerAction,
  tableInnerContext,
  wrapRef,
});

/**
 * 渲染表格
 */
const renderTable = () => {
  const vNodeList = [
    <VxeGrid
      columns={unref(getTableColumns) as VxeGridPropTypes.Column[]}
      ref={vxeTableInstance}
      {...unref(getSmartTableBindValues)}
    >
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
