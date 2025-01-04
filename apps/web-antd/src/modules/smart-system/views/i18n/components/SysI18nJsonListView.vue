<script lang="ts" setup>
import { useSmartTable } from '#/adapter/smart-table';
import { createConfirm, successMessage } from '#/utils';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { useInjectPageDict } from '@vben/preferences';
import { onMounted } from 'vue';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  reloadApi,
  setUseYnApi,
} from './SysI18nJsonListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
  PLATFORM_DICT_KEY,
} from './SysI18nJsonListView.config';

const { getTableSize } = useSizeSetting();
const { pageDictRegister, pageDictMap } = useInjectPageDict();
pageDictRegister(PLATFORM_DICT_KEY);

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
  id: 'smart-sys-i18n-json-head-list-view',
  customConfig: { storage: true },
  columns: getTableColumns(pageDictMap),
  height: 'auto',
  checkboxConfig: true,
  border: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  showOverflow: 'tooltip',
  showHeaderOverflow: 'tooltip',
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
      labelWidth: 90,
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-1 grid',
    },
  },
  proxyConfig: {
    autoLoad: false,
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
    column: true,
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
      {
        code: 'useYnTrue',
        auth: Permissions.setUseYn,
      },
      {
        code: 'useYnFalse',
        auth: Permissions.setUseYn,
      },
      {
        name: t('system.views.i18n.i18n.button.reload'),
        customRender: 'ant',
        props: {
          preIcon: 'ant-design:reload-outlined',
          type: 'primary',
          onClick: () => handleReload(),
        },
      },
    ],
  },
});

onMounted(() => tableApi.query());
</script>

<template>
  <div class="h-full">
    <SmartTable v-bind="$attrs" :size="getTableSize as never" />
  </div>
</template>
