<script setup lang="tsx">
import type { VxeGridInstance, VxeGridProps } from 'vxe-table';

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
  onMounted,
  ref,
  unref,
  useAttrs,
  useSlots,
  useTemplateRef,
} from 'vue';

import { buildUUID, cn } from '@vben-core/shared/utils';

import { VxeGrid, VxeUI } from 'vxe-table';

import { useSmartTableAjax } from '../hooks/useSmartTableAjax';
import { useSmartTableCheckbox } from '../hooks/useSmartTableCheckbox';
import { useSmartTableColumn } from '../hooks/useSmartTableColumn';
import { createSmartTableContext } from '../hooks/useSmartTableContext';
import { useSmartTableDynamicClassStyle } from '../hooks/useSmartTableDynamicClassStyle';
import { useSmartTableLoading } from '../hooks/useSmartTableLoading';
import { useSmartTableModalAddEditEdit } from '../hooks/useSmartTableModalAddEdit';
import { useSmartTablePagerConfig } from '../hooks/useSmartTablePager';
import { useSmartTableRow } from '../hooks/useSmartTableRow';
import { useSmartTableSearchForm } from '../hooks/useSmartTableSearchForm';
import { useSmartTableToolbar } from '../hooks/useSmartTableToolbar';
import { DEFAULT_SETUP_HANDLER } from '../init';

interface Props extends SmartTableRenderProps {}

defineOptions({
  inheritAttrs: false,
  name: 'SmartTable',
});

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
const vxeTableInstance = useTemplateRef<VxeGridInstance>('gridRef');
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
const { updateRowByIdProxy } = useSmartTableRow(
  computedTableProps,
  getSmartTableContext,
);
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
  computedHasSeparator,
  computedSearchFormVisible,
  computedSeparatorBackground,
  computedSeparatorTop,
  getEnableSearchForm,
  getSearchFormParameter,
  SearchForm,
  searchFormApi,
  switchSearchFormVisible,
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
  getAddEditModal,
  showAddModal,
} = useSmartTableModalAddEditEdit(
  computedTableProps,
  getSmartTableContext,
  emitHandler,
  t,
  computedSlots,
);

const { computedToolbarConfig, getToolbarEvents } = useSmartTableToolbar(
  computedTableProps,
  getSmartTableContext,
  t,
  emitHandler,
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
    ...unref(getToolbarEvents),
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
  getAddEditModal: () => getAddEditModal(),
  getGrid: () => getVxeTableInstance()!,
  getSearchForm: () => searchFormApi,
  query: (params) => query(params),
  setLoading: (loading: boolean) => setLoading(loading),
  setPagerConfig,
  setUseYnByCheckbox,
  setUseYnByRow,
  showAddModal: (selectData, formData) => showAddModal(selectData, formData),
  switchSearchFormVisible,
  updateRowByIdProxy,
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

/**
 * 搜索栏显示隐藏，表格高度不会自动计算，不确定是什么原因
 * 动态调整表格容器高度，让表格再次计算高度
 */
const computedStyle = computed(() => {
  if (unref(computedSearchFormVisible)) {
    return {};
  }
  return {
    height: 'calc(100% - 1px)',
  };
});

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

onMounted(() => {
  emit('register', tableAction);
});

defineExpose({
  ...tableAction,
});
</script>

<template>
  <div
    :style="computedStyle"
    :class="cn('smart-table bg-background h-full', props.class)"
  >
    <VxeGrid
      :columns="computedTableColumns"
      ref="gridRef"
      v-bind="getSmartTableBindValues"
    >
      <template
        v-for="(_, solotName) in computedTableSlots"
        :key="solotName"
        #[solotName]="slotProps"
      >
        <slot :name="solotName" v-bind="slotProps"></slot>
      </template>
      <template #form>
        <div
          v-if="getEnableSearchForm"
          v-show="computedSearchFormVisible"
          class="overflow-hidden pt-[10px]"
        >
          <div
            v-if="computedHasSeparator && !computedSeparatorTop"
            :style="{
              ...(computedSeparatorBackground
                ? { backgroundColor: computedSeparatorBackground }
                : undefined),
            }"
            class="bg-background-deep h-[5px]"
          ></div>
          <slot name="form">
            <SearchForm class="pt-[5px]" />
          </slot>
          <div
            v-if="computedHasSeparator && computedSeparatorTop"
            :style="{
              ...(computedSeparatorBackground
                ? { backgroundColor: computedSeparatorBackground }
                : undefined),
            }"
            class="bg-background-deep h-[5px]"
          ></div>
        </div>
      </template>
    </VxeGrid>
    <!--  添加修改表单  -->
    <AddEditModal v-if="computedHasAddEdit" />
  </div>
</template>

<style lang="less" scoped></style>
