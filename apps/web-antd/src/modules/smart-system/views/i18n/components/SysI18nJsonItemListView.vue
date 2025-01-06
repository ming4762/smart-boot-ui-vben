<script lang="ts" setup>
import type { SmartTableActionItem } from '#/adapter/smart-table';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { warnMessage } from '#/utils';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { watch } from 'vue';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from './SysI18nJsonItemListView.api';
import {
  getFormSchemas,
  getTableColumns,
  Permissions,
} from './SysI18nJsonItemListView.config';

interface Props {
  i18nId?: number;
}

const props = defineProps<Props>();

const { getTableSize } = useSizeSetting();

const validateI18nId = () => {
  if (!props.i18nId) {
    warnMessage('请先选择国际化信息');
    return false;
  }
  return true;
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-sys-i18n-json-item-list-view',
  customConfig: { storage: true },
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
  },
  checkboxConfig: true,
  showOverflow: 'tooltip',
  showHeaderOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: false,
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'h-full flex flex-col',
      class: 'h-full',
    },
    modalConfig: {
      fullscreen: true,
    },
  },
  proxyConfig: {
    ajax: {
      query: async (params) => {
        if (!props.i18nId) {
          return [];
        }
        return listApi({
          ...params.ajaxParameter,
          parameter: {
            ...params.ajaxParameter?.parameter,
            'headId@=': props.i18nId,
          },
        });
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const insertList = insertRecords.map((item) => ({
          ...item,
          headId: props.i18nId,
        }));
        return batchSaveUpdateApi([...insertList, ...updateRecords]);
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
      useYn: setUseYnApi,
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permissions.save,
        props: {
          onClick: () => {
            if (!validateI18nId()) {
              return false;
            }
            tableApi.showAddModal();
          },
        },
      },
      {
        code: 'ModalEdit',
        auth: Permissions.update,
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

watch(
  () => props.i18nId,
  () => {
    tableApi.query();
  },
);

const getActions = (row: Record<string, any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
      auth: Permissions.update,
    },
  ];
};
</script>

<template>
  <div class="h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>
