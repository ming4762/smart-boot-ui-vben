<script setup lang="tsx">
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeGridPropTypes,
} from 'vxe-table';

import type { Slots } from 'vue';

import type { SmartAuthType } from '@vben-core/typings';

import type {
  SmartTableAction,
  SmartTableRenderListeners,
  SmartTableRenderProps,
} from '../types';
import type { SmartTableInnerActionType } from '../types/SmartTableActionType';
import type {
  SmartTableContext,
  SmartTableContextHandler,
  SmartTableInnerContext,
} from '../types/SmartTableInnerType';

import {
  computed,
  h,
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
import { createSmartTableContext } from '../hooks/useSmartTableContext';
import { useSmartTableDynamicClassStyle } from '../hooks/useSmartTableDynamicClassStyle';
import { useSmartTableLoading } from '../hooks/useSmartTableLoading';
import { useSmartTableModalAddEditEdit } from '../hooks/useSmartTableModalAddEdit';
import { useSmartTablePagerConfig } from '../hooks/useSmartTablePager';
import { useSmartTableSearchForm } from '../hooks/useSmartTableSearchForm';
import { useSmartTableToolbar } from '../hooks/useSmartTableToolbar';
import { DEFAULT_SETUP_HANDLER } from '../init';

interface Props extends SmartTableRenderProps {}

const props = withDefaults(defineProps<Props>(), {
  column: [],
  id: buildUUID(),
  size: () => 'small',
});
const emit = defineEmits<SmartTableRenderListeners>();
const slots = useSlots();
const attrs = useAttrs();

const smartTableContext: SmartTableContext = {} as never;
const getSmartTableContext: SmartTableContextHandler = (): SmartTableContext =>
  smartTableContext;

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
 * 表格插槽
 */
const computedSlots = computed<Slots>(() => {
  const defaultSlotsHandler = DEFAULT_SETUP_HANDLER.defaultSlots;
  if (!defaultSlotsHandler) {
    return slots;
  }
  const defaultSlots = defaultSlotsHandler();
  if (!defaultSlots || Object.keys(defaultSlots).length === 0) {
    return slots;
  }
  return {
    ...defaultSlots,
    ...slots,
  };
});

/**
 * 列动态class style支持
 */
const { computedTableClassStyle } =
  useSmartTableDynamicClassStyle(computedTableProps);

/**
 * 表格加载状态
 */
const { getLoading, setLoading } = useSmartTableLoading(computedTableProps);

// 列调整
const { computedTableColumns } = useSmartTableColumn(computedTableProps, t);
// 分页
const { computedPagerConfig, setPagerConfig } =
  useSmartTablePagerConfig(computedTableProps);
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
} = useSmartTableSearchForm(
  computedTableProps,
  getSmartTableContext,
  emitHandler,
  t,
  computedSlots,
);

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
} = useSmartTableAjax(computedTableProps, getSmartTableContext, emitHandler, t);

const {
  AddEditModal,
  computedHasAddEdit,
  editByCheckbox,
  editByRowModal,
  getAddEditForm,
  showAddModal,
} = useSmartTableModalAddEditEdit(
  computedTableProps,
  getSmartTableContext,
  emitHandler,
  t,
  computedSlots,
);

const { computedToolbarConfig } = useSmartTableToolbar(
  computedTableProps,
  getSmartTableContext,
  t,
);

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
    ...unref(computedTableClassStyle),
  } as VxeGridProps;
});

const computedTableSlots = computed(() => {
  return {
    ...unref(computedSlots),
  };
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
  setPagerConfig,
  setUseYnByCheckbox,
  setUseYnByRow,
  showAddModal: (selectData, formData) => showAddModal(selectData, formData),
};

const defaultAuthHandler = (code?: SmartAuthType) => {
  return !code;
};

const tableInnerAction: SmartTableInnerActionType = {
  getSearchFormParameter,
  hasPermission: props.authConfig?.authHandler ?? defaultAuthHandler,
  setSmartTableProps,
};

const tableInnerContext: SmartTableInnerContext = {
  computedSearchFormVisible,
  tableLoading: getLoading,
};

Object.assign(smartTableContext, {
  ...tableAction,
  getBindValues: computedTableProps,
  id: props.id as string,
  t,
  tableInnerAction,
  tableInnerContext,
  wrapRef,
});

createSmartTableContext(smartTableContext);

/**
 * 渲染表格
 */
const renderTable = () => {
  const vNodeList = [
    h(
      VxeGrid,
      {
        columns: unref(computedTableColumns) as VxeGridPropTypes.Column[],
        ref: vxeTableInstance,
        ...unref(getSmartTableBindValues),
      },
      unref(computedTableSlots),
    ),
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
  return h(
    TableSearchLayout,
    {
      class: 'smart-table',
      ref: 'wrapRef',
      showSearch: unref(computedSearchFormVisible),
    },
    slots,
  );
};

onMounted(() => {
  emit('register', tableAction);
});

defineExpose({
  ...tableAction,
});
</script>

<template>
  <RenderFunction />
</template>

<style lang="less" scoped></style>
