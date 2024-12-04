<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { useInjectPageDict } from '@vben/preferences';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';
import { createConfirm } from '#/utils';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setDefaultApi,
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
  columns: getTableColumns(),
  height: 'auto',
  pagerConfig: true,
  useSearchForm: true,
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'text-left col-span-1 pb-2 ml-1.5',
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
          const formatData: Recordable<any> = {};
          Object.keys(storageConfig).forEach((item) => {
            formatData[`${storageConfigPrefix}.${storageType}.${item}`] =
              storageConfig[item];
          });
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
    column: { columnOrder: true },
    buttons: [
      {
        code: 'ModalAdd',
        auth: 'smart:fileStorage:save',
      },
      {
        code: 'delete',
        auth: 'smart:fileStorage:delete',
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
        <span>{{ pageDictMap?.FILE_STORAGE_TYPE?.[row.storageType] }}</span>
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
