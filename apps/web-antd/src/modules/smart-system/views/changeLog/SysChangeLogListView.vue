<script lang="ts" setup>
import { useSizeSetting } from '@vben/hooks';
import { convertToTimezone } from '@vben/utils';

import { useSmartTable } from '#/adapter/smart-table';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
} from './SysChangeLogListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from './SysChangeLogListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable] = useSmartTable({
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
  },
  showOverflow: 'tooltip',
  checkboxConfig: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 70,
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-1 grid',
    },
    modalConfig: {
      fullscreen: true,
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const data = await getByIdApi(params.id);
        if (!data) {
          return data;
        }
        return convertToTimezone(data, ['logTime']);
      },
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permissions.save,
      },
      {
        code: 'ModalEdit',
        auth: Permissions.update,
      },
      {
        code: 'delete',
        auth: Permissions.delete,
      },
    ],
  },
});
</script>

<template>
  <div class="page-container smart-table-padding h-full">
    <SmartTable :size="getTableSize as never" />
  </div>
</template>
