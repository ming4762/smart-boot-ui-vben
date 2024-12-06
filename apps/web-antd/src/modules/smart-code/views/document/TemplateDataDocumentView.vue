<script setup lang="ts">
import { useSizeSetting } from '@vben/hooks';

import {
  getTableBooleanColumnClass,
  useSmartTable,
} from '#/adapter/smart-table';
import { ApiServiceEnum, requestClient } from '#/api/request';

const { getTableSize } = useSizeSetting();

const [SmartTable] = useSmartTable({
  height: 'auto',
  stripe: true,
  border: true,
  treeConfig: {
    childrenField: 'fieldList',
  },
  rowConfig: {
    isHover: true,
  },
  columns: [
    {
      title: '属性',
      field: 'name',
      width: 240,
      fixed: 'left',
      treeNode: true,
    },
    {
      title: '说明',
      field: 'remark',
      minWidth: 240,
    },
    {
      title: '参数|返回值',
      field: 'type',
      width: 120,
    },
    {
      title: '可选值',
      field: 'optional',
      width: 180,
    },
    {
      title: '默认值',
      field: 'defaultValue',
      width: 200,
    },
    {
      ...getTableBooleanColumnClass('nullable'),
      title: '是否可null',
      width: 120,
    },
  ],
  proxyConfig: {
    ajax: {
      query(): Promise<any> {
        return requestClient.post(
          'db/code/main/getTemplateDataDocument',
          {},
          {
            service: ApiServiceEnum.SMART_CODE,
          },
        );
      },
    },
  },
});
</script>

<template>
  <div class="page-container db-code-document h-full">
    <SmartTable :size="getTableSize as never" />
  </div>
</template>

<style scoped>
.db-code-document {
  :deep(.smart-table-container) {
    padding: 0;
  }
}
</style>
