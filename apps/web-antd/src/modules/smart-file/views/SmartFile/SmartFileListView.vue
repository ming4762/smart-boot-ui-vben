<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { SmartTableActionItem } from '#/adapter/smart-table';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { Upload } from 'ant-design-vue';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SmartIconButton } from '#/components';

import {
  deleteApi,
  downloadApi,
  getByIdApi,
  listApi,
  uploadFileApi,
} from './SmartFileListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartFileListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-file-fileList',
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  pagerConfig: true,
  useSearchForm: true,
  checkboxConfig: true,
  stripe: true,
  showOverflow: 'tooltip',
  rowConfig: {
    keyField: 'fileId',
    isCurrent: true,
    isHover: true,
  },
  customConfig: {
    storage: true,
  },
  columnConfig: {
    resizable: true,
  },
  sortConfig: {
    remote: true,
    defaultSort: { field: 'createTime', order: 'desc' },
  },
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    schema: getSearchFormSchemas(),
    compact: true,
    searchWithSymbol: true,
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
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords } }) => {
        const dataList = [...insertRecords];
        if (dataList.length === 0) {
          return Promise.resolve();
        }
        const { fileStorageId, fileName, type, seq, fileList } = dataList[0];
        return uploadFileApi(
          {
            fileStorageId,
            fileName,
            type,
            seq,
          },
          fileList[0].originFileObj,
        );
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    sizeSetting: true,
    custom: true,
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
      code: 'delete',
      onClick: () => tableApi.deleteByRow(row),
      danger: true,
    },
    {
      label: t('common.button.download'),
      preIcon: 'ant-design:download-outlined',
      auth: 'smart:file:download',
      onClick: async () => {
        await downloadApi(row.fileId);
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
      <template #form-upload="{ model }">
        <Upload
          v-model:file-list="model.fileList"
          :before-upload="() => false"
          :max-count="1"
        >
          <SmartIconButton pre-icon="ant-design:download-outlined">
            Upload
          </SmartIconButton>
        </Upload>
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
