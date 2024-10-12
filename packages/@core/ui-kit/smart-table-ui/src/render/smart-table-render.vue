<script setup lang="tsx">
import type { SmartTableRenderProps } from '../types';

import { computed, unref } from 'vue';

// import { $t } from '@vben/locales';
import { VbenForm } from '@vben-core/form-ui';
import { buildUUID } from '@vben-core/shared/utils';

import { VxeGrid, type VxeGridProps } from 'vxe-table';

import TableSearchLayout from '../components/TableSearchLayout.vue';
import { defaultCheckboxConfig } from '../defaultConfig';
// import { useSmartTableColumn } from '../hooks/useSmartTableColumn';

interface Props extends SmartTableRenderProps {}

const props = withDefaults(defineProps<Props>(), {
  checkboxConfig: () => defaultCheckboxConfig,
  column: [],
  id: buildUUID(),
  size: 'small',
});

// const { computedTableColumns } = useSmartTableColumn(props, $t);

/**
 * 表格计算属性
 */
const computedTableProps = computed<VxeGridProps>(() => {
  return {
    ...props,
    // columns: unref(computedTableColumns),
  } as VxeGridProps;
});

const renderTable = () => {
  const result = [<VxeGrid {...unref(computedTableProps)}></VxeGrid>];
  return result;
};

const renderSearchForm = () => {
  return [<VbenForm></VbenForm>];
};

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
