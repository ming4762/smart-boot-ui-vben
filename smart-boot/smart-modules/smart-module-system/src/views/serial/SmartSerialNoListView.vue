<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
} from '#/views/serial/SmartSerialNoListView.api';

import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartSerialNoListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-tool-serial',
  customConfig: { storage: true },
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  showOverflow: 'tooltip',
  stripe: true,
  checkboxConfig: true,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isCurrent: true,
    isHover: true,
  },
  sortConfig: {
    remote: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    compact: true,
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-2 grid',
    },
    modalConfig: {
      class: 'w-[800px]',
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
    custom: true,
    sizeSetting: true,
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

const getActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
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
