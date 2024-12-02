<script setup lang="ts">
import { watch } from 'vue';

import { $t as t } from '@vben/locales';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';

import {
  batchDeleteI18nItemByIdApi,
  getI18nItemByIdApi,
  listI18nItemApi,
  saveUpdateI18nItemApi,
} from './i18n.api';
import {
  getI18nItemListAddEditFormSchema,
  getI18nItemListTableColumn,
  Permission,
} from './i18n.config';

interface Props {
  i18nId?: number;
}

const props = defineProps<Props>();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-i18n-i18nItemList',
  height: 'auto',
  stripe: true,
  border: true,
  columns: getI18nItemListTableColumn(),
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isCurrent: true,
  },
  customConfig: { storage: true },
  addEditConfig: {
    formConfig: {
      schema: getI18nItemListAddEditFormSchema(),
    },
  },
  proxyConfig: {
    ajax: {
      query: async ({ ajaxParameter }) => {
        if (!props.i18nId) {
          return [];
        }
        return listI18nItemApi({
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'i18nId@=': props.i18nId,
          },
        });
      },
      delete: ({ body: { removeRecords } }) =>
        batchDeleteI18nItemByIdApi(
          removeRecords.map((item) => item.i18nItemId),
        ),
      getById: ({ i18nItemId }) => getI18nItemByIdApi(i18nItemId),
      save: ({ body: { insertRecords, updateRecords } }) => {
        const model = [...insertRecords, ...updateRecords][0];
        return saveUpdateI18nItemApi({
          ...model,
          i18nId: props.i18nId,
        });
      },
    },
  },
  toolbarConfig: {
    refresh: true,
    resizable: true,
    zoom: true,
    column: {
      columnOrder: true,
    },
    buttons: [{ code: 'ModalAdd' }, { code: 'delete' }],
  },
});

const getTableActions = (row): SmartTableActionItem[] => {
  return [
    {
      auth: Permission.update,
      label: t('common.button.edit'),
      onClick: () => {
        tableApi.editByRowModal(row);
      },
    },
  ];
};
watch(
  () => props.i18nId,
  () => tableApi.query(),
);
</script>

<template>
  <div class="h-full">
    <SmartTable>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
