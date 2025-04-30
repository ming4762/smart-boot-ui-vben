<script setup lang="ts">
import { watch } from 'vue';

import { useSmartTable } from '#/adapter/smart-table';

import { listUserApi } from '../SysDept.api';
import { getUserColumns, getUserSearchSchemas } from '../SysDept.conf';

interface Props {
  deptId?: number;
}

const props = defineProps<Props>();

watch(
  () => props.deptId,
  () => {
    tableApi.query();
  },
);

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-sys-dept-user-list',
  customConfig: { storage: true },
  columns: getUserColumns(),
  stripe: true,
  height: 'auto',
  border: true,
  rowConfig: {
    isHover: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  checkboxConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  searchFormConfig: {
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex  flex-wrap',
    schema: getUserSearchSchemas(),
    commonConfig: {
      componentProps: {
        // style: {
        //   maxWidth: '150px',
        // },
      },
      labelWidth: 60,
      formItemClass: 'pb-2',
    },
    searchWithSymbol: true,
  },
  showOverflow: 'tooltip',
  proxyConfig: {
    ajax: {
      query: async ({ ajaxParameter }) => {
        if (!props.deptId) {
          return {
            total: 0,
            records: [],
          };
        }
        const parameter = {
          ...ajaxParameter,
          deptIdList: [props.deptId],
        };
        return listUserApi(parameter);
      },
    },
  },
  toolbarConfig: {
    refresh: true,
    resizable: true,
    custom: true,
    sizeSetting: true,
    zoom: true,
    buttons: [
      {
        name: '绑定用户',
        props: {
          type: 'primary',
          preIcon: 'ant-design:plus-outlined',
          onClick: () => {
            throw new Error('Not implemented yet');
          },
        },
        customRender: 'ant',
      },
      {
        name: '取消绑定',
        props: {
          type: 'primary',
          danger: true,
          preIcon: 'ant-design:delete-outlined',
          onClick: () => {
            throw new Error('Not implemented yet');
          },
        },
        customRender: 'ant',
      },
    ],
  },
});
</script>

<template>
  <div class="smart-table-padding user-table-container h-full">
    <SmartTable />
  </div>
</template>

<style scoped>
.user-table-container {
  background: hsl(var(--background-deep));

  :deep(.smart-search-container) {
    padding-top: 0 !important;
  }
}
</style>
