<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref, unref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { buildUUID, omit } from '@vben/utils';

import dayjs from 'dayjs';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';
import { SysSystemSimpleList } from '#/components';
import { createConfirm, successMessage } from '#/utils';

import {
  deleteApi,
  downloadApi,
  generatorApi,
  getByIdApi,
  listApi,
  saveUpdateBatchApi,
} from './LicenseListView.api';
import {
  getAddEditFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from './LicenseListView.config';

const { getTableSize } = useSizeSetting();

const currentSystemRef = ref<Recordable<any>>({});

const [SmartTable, tableApi] = useSmartTable({
  columns: getTableColumns(),
  border: true,
  height: 'auto',
  stripe: true,
  showOverflow: 'tooltip',
  highlightHoverRow: true,
  columnConfig: {
    resizable: true,
  },
  pagerConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  useSearchForm: true,
  searchFormConfig: {
    actionWrapperClass: 'text-left col-span-1 pb-2 ml-1.5',
    wrapperClass: 'flex flex-wrap',
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
    searchWithSymbol: true,
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
        const saveList = dataList.map((item) => {
          const times = item.times;
          const result = {
            ...item,
            effectiveTime: times[0],
            expirationTime: times[1],
          };
          return omit(result, ['times']);
        });
        return saveUpdateBatchApi(saveList);
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const result = await getByIdApi(params);
        const system = result.system;
        return {
          ...result,
          times: [dayjs(result.effectiveTime), dayjs(result.expirationTime)],
          systemName: `${system.name}(${system.code})`,
        };
      },
    },
  },
  printConfig: {},
  exportConfig: {},
  toolbarConfig: {
    refresh: true,
    zoom: true,
    column: {
      columnOrder: true,
    },
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permissions.save,
        props: {
          onClick: () => {
            const currentSystem = unref(currentSystemRef);
            tableApi.showAddModal({
              licenseCode: buildUUID(),
              systemId: currentSystem.id,
              systemName: `${currentSystem.name}(${currentSystem.code})`,
            });
          },
        },
      },
      {
        code: 'delete',
        auth: Permissions.delete,
      },
    ],
  },
  addEditConfig: {
    modalConfig: {
      class: 'w-[1000px]',
      fullscreen: true,
    },
    formConfig: {
      wrapperClass: 'grid-cols-2 grid',
      schema: getAddEditFormSchemas(),
    },
  },
});

/**
 * 系统变更时触发：更新数据
 */
const handleSelectSystemChange = (system: any) => {
  currentSystemRef.value = system;
  tableApi.query();
};

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      auth: Permissions.update,
      onClick: () => tableApi.editByRowModal(row),
    },
  ];
};

const getTableDropDownActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('system.views.license.button.generator'),
      preIcon: 'ant-design:check-outlined',
      auth: Permissions.generator,
      onClick: () => {
        const message =
          row.status === 'GENERATOR'
            ? t('system.views.license.message.rebuildGeneratorConfirm')
            : t('system.views.license.message.generatorConfirm');
        createConfirm({
          iconType: 'warning',
          type: 'confirm',
          content: message,
          onOk: async () => {
            try {
              // appStore.setPageLoading(true);
              await generatorApi(row.id);
              successMessage(
                t('system.views.license.message.generatorSuccess'),
              );
            } finally {
              // appStore.setPageLoading(false);
            }
            tableApi.query();
          },
        });
      },
    },
    {
      label: t('common.button.download'),
      preIcon: 'ant-design:download-outlined',
      auth: Permissions.download,
      disabled: row.status !== 'GENERATOR',
      onClick: async () => {
        try {
          // appStore.setPageLoading(true);
          await downloadApi(row.id);
        } finally {
          // appStore.setPageLoading(false);
        }
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate :show-line="false" class="h-full" first-size="240px">
      <template #first>
        <div class="system-container h-full">
          <SysSystemSimpleList
            :row-config="{ isHover: true, isCurrent: true }"
            height="auto"
            @current-change="handleSelectSystemChange"
          />
        </div>
      </template>
      <template #second>
        <SmartTable :size="getTableSize as never" class="license-view">
          <template #table-operation="{ row }">
            <SmartVxeTableAction
              :actions="getTableActions(row)"
              :drop-down-actions="getTableDropDownActions(row)"
            />
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped></style>
