<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref, unref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { Upload } from 'ant-design-vue';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';
import { SmartIconButton, SysSystemSimpleList } from '#/components';

import {
  deleteApi,
  download,
  getByIdApi,
  listApi,
  saveUpdateApi,
} from './SmartAuthSecretKeyListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartAuthSecretKeyListView.config';

const { getTableSize } = useSizeSetting();

const currentSystemRef = ref<Recordable<any>>({});
const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-auth-secret-key-list',
  columns: getTableColumns(),
  height: 'auto',
  pagerConfig: true,
  useSearchForm: true,
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  border: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'pb-2 ml-1.5',
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
      schema: getFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => {
        const parameter = {
          ...params.ajaxParameter,
          systemId: unref(currentSystemRef)?.id,
        };
        return listApi(parameter);
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const dataList = [...insertRecords, ...updateRecords];
        return saveUpdateApi({
          ...dataList[0],
          systemId: unref(currentSystemRef).id,
        });
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
    },
  },
  importConfig: {},
  exportConfig: {},
  toolbarConfig: {
    zoom: true,
    refresh: true,
    column: {
      columnOrder: true,
    },
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

/**
 * 系统变更时触发：更新数据
 */
const handleSelectSystemChange = (system: any) => {
  currentSystemRef.value = system;
  tableApi.query();
};

const getActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      auth: 'auth:secret:update',
      onClick: () => {
        tableApi.editByRowModal(row);
      },
    },
    {
      label: t('common.button.download'),
      auth: 'auth:secret:download',
      onClick: () => {
        download(row.id);
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate :show-line="false" class="h-full" first-size="240px">
      <template #first>
        <div class="full-height system-container bg-background">
          <SysSystemSimpleList
            :row-config="{ isHover: true, isCurrent: true }"
            height="auto"
            @current-change="handleSelectSystemChange"
          />
        </div>
      </template>
      <template #second>
        <SmartTable :size="getTableSize as never">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getActions(row)" />
          </template>
          <template #form-publicKeyFile="{ model }">
            <Upload
              v-model:file-list="model.publicKeyFileList"
              :before-upload="() => false"
              :max-count="1"
              accept=".keystore"
            >
              <SmartIconButton>Upload</SmartIconButton>
            </Upload>
          </template>
          <template #form-privateKeyFile="{ model }">
            <Upload
              v-model:file-list="model.privateKeyFileList"
              :before-upload="() => false"
              :max-count="1"
              accept=".keystore"
            >
              <SmartIconButton>Upload</SmartIconButton>
            </Upload>
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped>
.system-container {
  margin-right: 5px;
}
</style>
