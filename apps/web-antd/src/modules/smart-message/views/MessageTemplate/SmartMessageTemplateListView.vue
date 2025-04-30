<script setup lang="ts">
import type { SmartTableActionItem } from '#/adapter/smart-table';

import { useSizeSetting } from '@vben/hooks';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
} from './SmartMessageTemplateListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartMessageTemplateListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-message-template',
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
  },
  pagerConfig: true,
  columnConfig: {
    resizable: true,
  },
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  showOverflow: 'tooltip',
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    compact: true,
    actionWrapperClass: 'text-left',
    wrapperClass: 'flex flex-wrap',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
  },
  addEditConfig: {
    modalConfig: {
      fullscreen: true,
    },
    formConfig: {
      schema: getFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    sizeSetting: true,
    custom: true,
    buttons: [
      {
        code: 'ModalAdd',
      },
      {
        code: 'delete',
      },
    ],
  },
});

const getActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      onClick: () => {
        tableApi.editByRowModal(row);
      },
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
