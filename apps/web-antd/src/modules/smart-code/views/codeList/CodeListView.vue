<script setup lang="ts">
import type { Recordable } from '@vben/types';

import {
  SmartLayoutSeparate,
  type SmartTableActionItem,
  useVbenModal,
} from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SysSystemSimpleList } from '#/components';

import { deleteApi, listBySystemApi } from './CodeListView.api';
import { searchFormColumns, tableColumns } from './CodeListView.config';
import CodeCreateModal from './components/CodeCreateModal.vue';

const { getTableSize } = useSizeSetting();

let currentSystem: Recordable<any> = {};

const [RenderCodeCreateModal, modalApi] = useVbenModal({
  connectedComponent: CodeCreateModal,
});

const toDesign = (configId?: number) => {
  console.warn(configId);
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-tool-code-codeList',
  height: 'auto',
  columns: tableColumns(),
  useSearchForm: true,
  pagerConfig: true,
  checkboxConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'createTime',
      order: 'desc',
    },
  },
  customConfig: { storage: true },
  showOverflow: 'tooltip',
  border: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  stripe: true,
  searchFormConfig: {
    searchWithSymbol: true,
    schema: searchFormColumns(),
    actionWrapperClass: 'text-left pb-2 ml-1.5',
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
  columnConfig: {
    resizable: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: (params) => {
        const queryParameter = {
          ...params.ajaxParameter,
          systemId: currentSystem.id,
        };
        return listBySystemApi(queryParameter);
      },
      delete: ({ body }) => deleteApi(body.removeRecords),
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    column: { columnOrder: true },
    buttons: [
      {
        code: 'ModalAdd',
        props: {
          onClick: () => toDesign(),
        },
      },
      {
        code: 'delete',
      },
    ],
  },
});

const handleSelectSystemChange = (row: Recordable<any>) => {
  currentSystem = row;
  tableApi.query();
};

const getTableAction = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      onClick: () => toDesign(row.id),
    },
    {
      label: t('smart.code.views.codeManager.button.createCode'),
      onClick: () => {
        modalApi.setData(row);
        modalApi.open();
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate :show-line="false" class="h-full" first-size="240px">
      <template #first>
        <SysSystemSimpleList
          :row-config="{ isHover: true, isCurrent: true }"
          height="auto"
          @current-change="handleSelectSystemChange"
        />
      </template>
      <template #second>
        <SmartTable :size="getTableSize as never">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getTableAction(row)" />
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
    <RenderCodeCreateModal />
  </div>
</template>

<style scoped></style>
