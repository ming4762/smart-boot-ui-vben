<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { useInjectPageDict } from '@vben/preferences';

import {
  createConfirm,
  successMessage,
  warnMessage,
} from '@smart/common/utils';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setDefaultApi,
  setEncryptApi,
} from './SmartFileStorageListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartFileStorageListView.config';

const { getTableSize } = useSizeSetting();

const storageConfigPrefix = 'storageConfig';
const { pageDictRegister, pageDictMap } = useInjectPageDict();
pageDictRegister('FILE_STORAGE_TYPE');

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-file-storage-list-view',
  customConfig: { storage: true },
  columns: getTableColumns(),
  height: 'auto',
  checkboxConfig: true,
  pagerConfig: true,
  useSearchForm: true,
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    schema: getSearchFormSchemas(),
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
    modalConfig: {
      class: 'w-[600px]',
    },
    formConfig: {
      schema: getFormSchemas(),
    },
  },
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  columnConfig: {
    resizable: true,
  },
  border: true,
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        const params = {
          sortName: 'seq',
          ...ajaxParameter,
        };
        return listApi(params);
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const saveDatList = [...insertRecords, ...updateRecords];
        const formatDataList = saveDatList.map((item) => {
          // const result: any = {};
          // const storageConfig: Recordable = {};
          // const configKeyPrefix = storageConfigPrefix + '.' + item.storageType + '.';
          // Object.keys(item).forEach((key) => {
          //   if (!key.startsWith(storageConfigPrefix)) {
          //     result[key] = item[key];
          //   } else if (key.startsWith(configKeyPrefix)) {
          //     storageConfig[replace(key, configKeyPrefix, '')] = item[key];
          //   }
          // });
          // result.storageConfig = JSON.stringify(storageConfig);
          // return result;
          return {
            ...item,
            storageConfig: JSON.stringify(item.storageConfig[item.storageType]),
          };
        });
        return batchSaveUpdateApi(formatDataList);
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const result = await getByIdApi(params);
        if (result.storageConfig) {
          const storageConfig = JSON.parse(result.storageConfig);
          const storageType = result.storageType;
          const formatData: Recordable<any> = {
            [storageConfigPrefix]: {
              [storageType]: storageConfig,
            },
          };
          return {
            ...result,
            ...formatData,
          };
        }
        return result;
      },
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
        auth: 'smart:fileStorage:save',
      },
      {
        code: 'delete',
        auth: 'smart:fileStorage:delete',
      },
      {
        name: '文件加密',
        auth: 'smart:fileStorage:setFileEncrypt',
        customRender: 'ant',
        props: {
          type: 'primary',
          preIcon: 'ant-design:file-protect-outlined',
          onClick: () => {
            const selectRows = tableApi.getGrid()?.getCheckboxRecords();
            if (selectRows.length === 0) {
              warnMessage(t('smart.file.storage.message.selectedEncrypt'));
              return;
            }
            createConfirm({
              content: t('smart.file.storage.message.confirmEncrypt'),
              onOk: async () => {
                await setEncryptApi(selectRows.map((item) => item.id));
                tableApi.query();
                successMessage(t('common.message.operationSucceeded'));
              },
            });
          },
        },
      },
    ],
  },
});

const getActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      auth: 'smart:fileStorage:update',
      onClick: () => tableApi.editByRowModal(row),
    },
    {
      label: t('common.button.delete'),
      onClick: () => tableApi.deleteByRow(row),
      auth: 'smart:fileStorage:delete',
      danger: true,
    },
  ];
};

const getDropDownActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      label: t('smart.file.storage.button.setDefault'),
      preIcon: 'ant-design:check-outlined',
      disabled: row.defaultStorage === true,
      auth: 'smart:fileStorage:setDefault',
      onClick: () => {
        createConfirm({
          content: t('smart.file.storage.message.setDefault'),
          onOk: async () => {
            await setDefaultApi(row.id);
            tableApi.query();
          },
        });
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction
          :actions="getActions(row)"
          :drop-down-actions="getDropDownActions(row)"
        />
      </template>
      <template #table-storageType="{ row }">
        <span>{{
          pageDictMap?.get('FILE_STORAGE_TYPE')?.get(row.storageType)
        }}</span>
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
