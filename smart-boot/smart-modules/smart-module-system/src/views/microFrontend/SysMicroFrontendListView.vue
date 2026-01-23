<script lang="ts" setup>
import type { SmartTableActionItem } from '@vben/common-ui';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from './SysMicroFrontendListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from './SysMicroFrontendListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
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
    actionWrapperClass: 'gap-1',
    compact: true,
    layout: 'inline',
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
    modalConfig: {
      class: 'w-[800px]',
    },
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-2 grid',
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
      useYn: setUseYnApi,
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
        code: 'delete',
        auth: Permissions.delete,
      },
      {
        code: 'useYnTrue',
        auth: Permissions.setUseYn,
      },
      {
        code: 'useYnFalse',
        auth: Permissions.setUseYn,
      },
    ],
  },
});

const getActions = (row: Record<string, any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
      auth: Permissions.update,
    },
    {
      label: t('common.button.delete'),
      onClick: () => tableApi.deleteByRow(row),
      danger: true,
      auth: Permissions.delete,
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable class="smart-table-padding" :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>
