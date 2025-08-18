<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { useRouter } from 'vue-router';

import { SmartLayoutSeparate, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SysSystemSimpleList } from '#/components';
import { errorMessage } from '#/utils';

import { deleteApi, listBySystemApi } from './CodeListView.api';
import { searchFormColumns, tableColumns } from './CodeListView.config';
import CodeCreateModal from './components/CodeCreateModal.vue';

const { getTableSize } = useSizeSetting();

const router = useRouter();

let currentSystem: Recordable<any> = {};

const [RenderCodeCreateModal, modalApi] = useVbenModal({
  connectedComponent: CodeCreateModal,
});

const toDesign = (configId?: number) => {
  if (!currentSystem?.id) {
    errorMessage(t('smart.code.views.code.message.noSelectSystem'));
    return false;
  }
  router.push({
    path: '/code/codeDesign',
    query: {
      configId,
      systemId: currentSystem.id,
    },
  });
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
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    searchWithSymbol: true,
    schema: searchFormColumns(),
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
    custom: true,
    sizeSetting: true,
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
        <SmartTable class="smart-table-padding" :size="getTableSize as never">
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
