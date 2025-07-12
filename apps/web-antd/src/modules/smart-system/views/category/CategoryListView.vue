<script setup lang="ts">
import type { SmartTableActionItem } from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';

import {
  deleteApi,
  getByIdApi,
  listApi,
  saveUpdateApi,
} from './CategoryListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './CategoryListView.config';

const { getIsPlatformTenant } = useUserStore();

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-category-list-view',
  columns: getTableColumns(),
  checkboxConfig: true,
  border: true,
  stripe: true,
  height: 'auto',
  useSearchForm: true,
  pagerConfig: true,
  rowConfig: {
    keyField: 'id',
    isCurrent: true,
  },
  treeConfig: {
    parentField: 'parentId',
    lazy: true,
    reserve: true,
    rowField: 'id',
    loadMethod: async ({ row }) => {
      return listApi({}, row.id);
    },
    hasChildField: 'hasChild',
  },
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
    commonConfig: {
      labelWidth: 90,
      formItemClass: 'pb-2',
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(getIsPlatformTenant),
    },
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        props: {
          onClick: () =>
            tableApi.showAddModal({}, { parentId: 0, parentName: '根节点' }),
        },
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
        saveUpdateApi([...insertRecords, ...updateRecords][0]),
      delete: ({ body: { removeRecords } }) =>
        deleteApi(removeRecords.map((item) => item.id)),
      getById: (params) => getByIdApi(params.id),
    },
  },
});

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('system.views.category.button.addChild'),
      onClick: () =>
        tableApi.showAddModal(
          {},
          {
            parentId: row.id,
            parentName: row.categoryName,
            tenantCommonYn: row.tenantCommonYn,
          },
        ),
    },
    {
      code: 'edit',
      onClick: () => tableApi.editByRowModal(row),
    },
    {
      code: 'delete',
      onClick: () => tableApi.deleteByRow(row),
      danger: true,
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable>
      <template #table-option="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
