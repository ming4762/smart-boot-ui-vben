<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { SmartTableActionItem } from '#/adapter/smart-table';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SysTenantSelect } from '#/components';

import TestSignModal from './components/TestSignModal.vue';
import {
  deleteApi,
  getByIdApi,
  listApi,
  saveUpdateApi,
} from './SysAuthAccessSecretListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SysAuthAccessSecretListView.config';

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-tool-accessSecret',
  customConfig: { storage: true },
  checkboxConfig: true,
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
  },
  rowConfig: {
    isHover: true,
  },
  stripe: true,
  columnConfig: {
    resizable: true,
  },
  showOverflow: 'tooltip',
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    searchWithSymbol: true,
    wrapperClass: 'flex flex-wrap',
    actionWrapperClass: 'text-left',
    compact: true,
    schema: getSearchFormSchemas(),
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
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        saveUpdateApi([...insertRecords, ...updateRecords]),
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

const [Modal, modalApi] = useVbenModal({
  connectedComponent: TestSignModal,
});

const getActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
    },
    {
      label: '生成签名',
      onClick: () => {
        modalApi.setData({ id: row.id });
        modalApi.open();
      },
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
      <template #search-tenantId="{ model, size }">
        <SysTenantSelect
          v-model:value="model.tenantId"
          :size="size"
          allow-clear
          style="width: 120px"
        />
      </template>
      <template #addEdit-tenantId="{ model, size }">
        <SysTenantSelect
          v-model:value="model.tenantId"
          :size="size"
          allow-clear
        />
      </template>
    </SmartTable>
    <Modal />
  </div>
</template>

<style scoped></style>
