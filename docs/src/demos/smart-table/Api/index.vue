<script setup lang="ts">
import { useSmartTable } from '#/adapter/smart-table';

import { data } from './data';

const [SmartTable] = useSmartTable({
  border: true,
  columns: [
    {
      field: 'field',
      minWidth: 120,
      title: '属性',
      treeNode: true,
    },
    {
      field: 'description',
      title: '说明',
      width: 120,
    },
    {
      field: 'type',
      title: '类型/返回类型',
      width: 120,
    },
    {
      field: 'options',
      title: '可选值',
    },
    {
      field: 'default',
      title: '默认值/参数',
      width: 70,
    },
  ],
  data,
  rowConfig: {
    keyField: 'field',
  },
  size: 'mini',
  treeConfig: {
    rowField: 'field',
    childrenField: 'children',
  },
});
</script>

<template>
  <div class="vxe-table-api-container h-full w-full">
    <SmartTable />
  </div>
</template>

<style scoped>
.vxe-table-api-container {
  :deep(.vxe-table--header) {
    margin: 0 !important;
  }

  :deep(.vxe-table--body) {
    margin: 0 !important;
  }

  :deep(.vxe-body--column) {
    border: none !important;
  }

  :deep(.vxe-header--column) {
    border: none !important;
  }
}
</style>
