<script setup lang="tsx">
import type { ExtendSmartTableApi } from '@vben/common-ui';

import type { SmartTableActionItem } from '#/adapter/smart-table';

import { ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { Textarea } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SysTenantSelect } from '#/components';
import { createConfirm, successMessage, warnMessage } from '#/utils';

import ExceptionDetailModal from './components/ExceptionDetailModal.vue';
import { listApi, markResolvedApi } from './SysExceptionListView.api';
import {
  getSearchFormSchemas,
  getTableColumns,
} from './SysExceptionListView.config';

const { getIsPlatformTenant } = storeToRefs(useUserStore());

const resolvedMessageRef = ref('');
/**
 * 标记已处理
 */
const handlerMarkResolved = (tableApi: ExtendSmartTableApi) => {
  const grid = tableApi.getGrid();
  const selectRows = grid.getCheckboxRecords();
  if (selectRows.length === 0) {
    warnMessage(t('system.views.exception.message.noSelect'));
    return false;
  }
  resolvedMessageRef.value = '';
  createConfirm({
    iconType: 'warning',
    title: t('system.views.exception.button.markResolved'),
    content: () => {
      return (
        <Textarea
          placeholder={t('system.views.exception.validate.resolvedMessage')}
          rows={4}
          v-model={[resolvedMessageRef.value, 'value']}
        />
      );
    },
    onOk: async () => {
      await markResolvedApi({
        resolvedMessage: unref(resolvedMessageRef),
        exceptionIdList: selectRows.map((item) => item.id),
      });
      successMessage(t('system.views.exception.message.resolvedSuccess'));
      tableApi.query();
    },
  });
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-tool-exception',
  customConfig: { storage: true },
  border: true,
  showOverflow: 'tooltip',
  height: 'auto',
  stripe: true,
  pagerConfig: true,
  useSearchForm: true,
  checkboxConfig: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(getIsPlatformTenant),
    wrapperClass: 'grid-cols-5 grid',
    actionWrapperClass: 'col-span-1 text-left',
    compact: true,
    commonConfig: {
      componentProps: {
        controlClass: 'w-full',
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
    searchWithSymbol: true,
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      {
        name: t('system.views.exception.button.markResolved'),
        customRender: 'ant',
        props: {
          type: 'primary',
          preIcon: 'ant-design:check-outlined',
          onClick: () => handlerMarkResolved(tableApi),
        },
      },
    ],
  },
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'createTime',
      order: 'desc',
    },
  },
  columns: getTableColumns(),
  columnConfig: {
    resizable: true,
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) =>
        listApi({
          sortName: 'createTime',
          sortOrder: 'desc',
          ...ajaxParameter,
        }),
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  connectedComponent: ExceptionDetailModal,
});

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('system.views.exception.title.showStackTrace'),
      onClick: () => {
        modalApi.setData(row.id);
        modalApi.open();
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
      <template #search-tenantId="{ model, size }">
        <SysTenantSelect
          v-model:value="model.tenantId"
          :size="size"
          allow-clear
          class="w-full"
        />
      </template>
    </SmartTable>
    <Modal />
  </div>
</template>

<style scoped></style>
