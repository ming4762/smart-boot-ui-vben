<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { SmartLayoutSeparate, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SysSystemSimpleList } from '#/components';

import TemplateSelectedModal from './components/TemplateSelectedModal.vue';
import { handleTestConnected } from './DatabaseListHooks';
import {
  deleteApi,
  getByIdApi,
  listApi,
  saveUpdateApi,
} from './DatabaseListView.api';
import { addEditForm, searchForm, tableColumns } from './DatabaseListView.data';

const { getTableSize } = useSizeSetting();

let currentSystem: Recordable<any> = {};

const [RenderTemplateSelectedModal, modalApi] = useVbenModal({
  connectedComponent: TemplateSelectedModal,
});

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-tool-code-databaseList',
  customConfig: { storage: true },
  searchFormConfig: {
    searchWithSymbol: true,
    schema: searchForm(),
    actionWrapperClass: 'text-left col-span-1 pb-2 ml-1.5',
    wrapperClass: 'flex flex-wrap',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 0,
      formItemClass: 'pb-2',
    },
  },
  checkboxConfig: true,
  addEditConfig: {
    modalConfig: {
      class: 'w-[600px]',
    },
    formConfig: {
      schema: addEditForm(),
    },
  },
  columnConfig: {
    resizable: true,
  },
  border: true,
  stripe: true,
  height: 'auto',
  columns: tableColumns,
  useSearchForm: true,
  pagerConfig: true,
  sortConfig: {
    remote: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: (params) => {
        const queryParameter = {
          ...params.ajaxParameter,
          systemId: currentSystem.id,
        };
        return listApi(queryParameter);
      },
      delete: async ({ body }) => {
        await deleteApi(body.removeRecords);
      },
      getById: async (row) => {
        return getByIdApi(row.id);
      },
      save: async ({ body }) => {
        const { insertRecords, updateRecords } = body;
        const data = [...insertRecords, ...updateRecords][0];
        return saveUpdateApi(data);
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    buttons: [
      {
        // name: t('common.button.add'),
        code: 'ModalAdd',
        props: {
          onClick: () =>
            tableApi.showAddModal(
              {},
              {
                systemId: currentSystem.id,
              },
            ),
        },
      },
      {
        code: 'ModalEdit',
      },
      {
        code: 'delete',
      },
    ],
  },
});

const handleSelectSystemChange = (row: any) => {
  currentSystem = row;
  tableApi.query();
};

const getTableAction = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
    },
  ];
};

const getDropDownAction = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('smart.code.views.database.button.testConnected'),
      onClick: () =>
        handleTestConnected(row, (loading: boolean) =>
          tableApi.setLoading(loading),
        ),
    },
    {
      label: t('smart.code.views.database.button.createDic'),
      onClick: () => {
        modalApi.setData(row);
        modalApi.open();
      },
      auth: 'db:connection:createDic',
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartLayoutSeparate draggable class="h-full" first-size="240px">
      <template #first>
        <div class="bg-background h-full">
          <SysSystemSimpleList
            :row-config="{ isHover: true, isCurrent: true }"
            height="auto"
            @current-change="handleSelectSystemChange"
          />
        </div>
      </template>
      <template #second>
        <SmartTable :size="getTableSize as never" class="h-full">
          <template #table-operation="{ row }">
            <SmartVxeTableAction
              :actions="getTableAction(row)"
              :drop-down-actions="getDropDownAction(row)"
            />
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
    <RenderTemplateSelectedModal template-type="template_db_dict" />
  </div>
</template>

<style scoped></style>
