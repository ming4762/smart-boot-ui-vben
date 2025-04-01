<script setup lang="ts">
import { ref, unref } from 'vue';

import { Input } from 'ant-design-vue';

import { useSmartTable } from '#/adapter/smart-table';

import { listTenantApi } from '../SysTenantManagerPlatformView.api';

const InputSearch = Input.Search;

const searchValueRef = ref('');

const [SmartTable, tableApi] = useSmartTable({
  height: 'auto',
  border: false,
  columns: [
    {
      field: 'tenantName',
      title: '{system.views.tenant.manager.title.tenantName}',
      formatter: ({ row }) => {
        return `${row.tenantCode}-${row.tenantName}`;
      },
    },
  ],
  rowConfig: {
    isCurrent: true,
    isHover: true,
  },
  rowStyle: {
    cursor: 'pointer',
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        return listTenantApi(ajaxParameter);
      },
    },
  },
});

const handleSearch = () => {
  tableApi.query({
    searchInfo: {
      parameter: {
        'tenantName@like': unref(searchValueRef),
      },
    },
  });
};
</script>

<template>
  <div class="h-full">
    <div class="search-container">
      <InputSearch
        v-model:value="searchValueRef"
        @search="handleSearch"
        enter-button
      />
    </div>
    <div class="list-container">
      <SmartTable v-bind="$attrs" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.list-container {
  :deep(.smart-table-container) {
    padding: 0;
  }
  height: calc(100% - 32px);
}
.search-container {
  :deep(.ant-input-search-button) {
    border-radius: 0 !important;
  }
  :deep(.ant-input) {
    border-radius: 0;
  }
}
</style>
