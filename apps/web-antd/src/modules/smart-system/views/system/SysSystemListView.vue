<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { $t as t } from '@vben/locales';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';

import {
  deleteApi,
  getByIdApi,
  listApi,
  saveUpdateApi,
} from './SysSystemListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SysSystemListView.config';
import { useSetUser } from './SysSystemListViewHooks';

const { SelectUserModal, handleShowSetUser } = useSetUser();

const [SmartTable, tableApi] = useSmartTable({
  columns: getTableColumns(),
  height: 'auto',
  stripe: true,
  useSearchForm: true,
  columnConfig: {
    resizable: true,
  },
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  border: true,
  pagerConfig: true,
  searchFormConfig: {
    actionWrapperClass: 'text-left',
    compact: true,
    schema: getSearchFormSchemas(),
    wrapperClass: 'flex flex-wrap',
    searchWithSymbol: true,
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
    formConfig: {
      schema: getFormSchemas(),
    },
  },
  toolbarConfig: {
    refresh: true,
    column: true,
    zoom: true,
    showSearch: true,
    buttons: [
      {
        code: 'ModalAdd',
      },
      {
        code: 'delete',
      },
    ],
  },
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        saveUpdateApi(insertRecords, updateRecords),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
    },
  },
});

const getActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      onClick: () => tableApi.editByRowModal(row),
    },
    {
      code: 'delete',
      onClick: () => tableApi.deleteByRow(row),
      danger: true,
    },
    {
      label: t('system.views.system.button.setUser'),
      onClick: () => {
        handleShowSetUser(row);
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable>
      <template #table-option="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
    <SelectUserModal />
  </div>
</template>

<style scoped></style>
