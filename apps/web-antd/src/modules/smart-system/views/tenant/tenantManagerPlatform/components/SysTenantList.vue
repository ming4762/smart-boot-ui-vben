<script setup lang="ts">
import { ref, unref } from 'vue';

import { Input } from 'ant-design-vue';

import { useSmartTable } from '#/adapter/smart-table';

import { listTenantApi } from '../SysTenantManagerPlatformView.api';

const emit = defineEmits(['currentChange']);

const InputSearch = Input.Search;

const searchValueRef = ref('');

const [SmartTable, tableApi] = useSmartTable({
  height: 'auto',
  border: false,
  useSearchForm: false,
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
  handleCurrentChange({ row: null });
};

const handleCurrentChange = ({ row }: any) => {
  emit('currentChange', row);
};

const handleProxyQuery = () => {
  const tableData = tableApi.getGrid()?.getData();
  if (tableData?.length > 0) {
    tableApi.getGrid()?.setCurrentRow(tableData[0]);
    handleCurrentChange({ row: tableData[0] });
  }
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
      <SmartTable
        @current-change="handleCurrentChange"
        @proxy-query="handleProxyQuery"
        v-bind="$attrs"
      />
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
