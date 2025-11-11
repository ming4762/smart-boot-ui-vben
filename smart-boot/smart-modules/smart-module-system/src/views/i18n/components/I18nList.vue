<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { watch } from 'vue';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { createConfirm, successMessage } from '@smart/common/utils';

import {
  getI18nByIdApi,
  i18nDeleteApi,
  i18nSaveUpdateApi,
  listI18nApi,
  reloadApi,
} from './i18n.api';
import {
  getI18nAddEditSchemas,
  getI18nTableColumns,
  Permission,
} from './i18n.config';

interface Props {
  groupId?: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['change']);

const handleCurrentChange = ({ row }: any) => {
  emit('change', row.i18nId);
};

const handleReload = () => {
  createConfirm({
    title: t('system.views.i18n.i18n.message.reloadConfirm'),
    content: t('system.views.i18n.i18n.message.reloadContent'),
    onOk: async () => {
      await reloadApi();
      successMessage(t('system.views.i18n.i18n.message.reloadSuccess'));
    },
  });
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-i18n-i18nList',
  height: 'auto',
  stripe: true,
  columns: getI18nTableColumns(),
  useSearchForm: true,
  pagerConfig: true,
  border: true,
  showOverflow: 'tooltip',
  rowConfig: {
    isCurrent: true,
  },
  customConfig: { storage: true },
  columnConfig: {
    resizable: true,
  },
  sortConfig: {
    remote: true,
    defaultSort: { field: 'seq', order: 'asc' },
  },
  searchFormConfig: {
    searchWithSymbol: true,
    schema: [
      {
        label: t('system.views.i18n.i18n.titleI18nCode'),
        fieldName: 'i18nCode',
        component: 'Input',
        searchSymbol: 'like',
      },
    ],
    actionWrapperClass: 'text-left',
    compact: true,
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
    formConfig: {
      schema: getI18nAddEditSchemas(),
    },
  },
  toolbarConfig: {
    refresh: true,
    resizable: true,
    zoom: true,
    custom: true,
    buttons: [
      {
        name: t('system.views.i18n.i18n.button.reload'),
        customRender: 'ant',
        auth: Permission.reload,
        props: {
          preIcon: 'ant-design:reload-outlined',
          type: 'primary',
          onClick: () => handleReload(),
          size: 'small',
        },
      },
      { code: 'ModalAdd' },
      { code: 'ModalEdit' },
      { code: 'delete' },
    ],
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        let groupId = props.groupId;
        if (groupId === null) {
          groupId = undefined;
        }
        const parameter = {
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'groupId@=': groupId,
          },
        };
        return listI18nApi(parameter);
      },
      getById: (model) => getI18nByIdApi(model.i18nId),
      save: ({ body: { insertRecords, updateRecords } }) => {
        if (insertRecords?.length > 0) {
          insertRecords.forEach((item) => {
            item.groupId = props.groupId;
          });
        }
        return i18nSaveUpdateApi([...insertRecords, ...updateRecords][0]);
      },
      delete: ({ body: { removeRecords } }) => i18nDeleteApi(removeRecords),
    },
  },
});

watch(
  () => props.groupId,
  async () => {
    await tableApi.query();
    emit('change', null);
  },
);

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      preIcon: 'ant-design:edit-out-lined',
      auth: Permission.update,
      onClick: () => tableApi.editByRowModal(row),
    },
  ];
};
</script>

<template>
  <div class="h-full">
    <SmartTable @current-change="handleCurrentChange">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
