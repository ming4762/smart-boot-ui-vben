<script lang="ts" setup>
import type { SmartTableActionItem } from '#/adapter/smart-table';

import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { warnMessage } from '#/utils';

import SlowSqlDetailModal from './components/SlowSqlDetailModal.vue';
import { getByIdApi, listApi } from './SmartMonitorSlowSqlListView.api';
import {
  getSearchFormSchemas,
  getTableColumns,
} from './SmartMonitorSlowSqlListView.config';

const { getTableSize } = useSizeSetting();

const [SlowSqlDetailModalRender, modalApi] = useVbenModal({
  connectedComponent: SlowSqlDetailModal,
});

const [SmartTable, tableApi] = useSmartTable({
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'createTime',
      order: 'desc',
    },
  },
  checkboxConfig: true,
  showOverflow: 'tooltip',
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
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    compact: true,
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 70,
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      getById: (params) => getByIdApi(params.id),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      {
        name: t('common.button.look'),
        props: {
          type: 'primary',
          size: 'small',
          preIcon: 'ant-design:eye-outlined',
          onClick: () => {
            const checkboxRecord = tableApi.getGrid().getCheckboxRecords();
            if (checkboxRecord.length !== 1) {
              warnMessage('请选择一条数据');
              return false;
            }
            modalApi.setData({ id: checkboxRecord[0].id });
            modalApi.open();
          },
        },
        customRender: 'ant',
      },
    ],
  },
});

const getActions = (row: Record<string, any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.look'),
      onClick: () => {
        modalApi.setData({ id: row.id });
        modalApi.open();
      },
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
    <SlowSqlDetailModalRender />
  </div>
</template>
