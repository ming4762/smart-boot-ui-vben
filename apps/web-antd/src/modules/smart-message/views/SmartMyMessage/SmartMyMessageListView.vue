<script setup lang="ts">
import { type ExtendSmartTableApi, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';
import { createConfirm, successMessage, warnMessage } from '#/utils';

import SystemMessageShowModal from '../../components/SystemMessageShowModal.vue';
import {
  markAsReadApi,
  pageCurrentUserMessageApi,
} from './SmartMyMessageListView.api';
import {
  getSearchFormSchemas,
  getTableColumns,
} from './SmartMyMessageListView.config';

const { getTableSize } = useSizeSetting();

/**
 * 标记已读
 */
const handleMarkRead = (tableApi: ExtendSmartTableApi) => {
  const gridInstance = tableApi.getGrid();
  const selectRows = gridInstance.getCheckboxRecords(false);
  const parameter: any = {};
  if (selectRows.length === 0) {
    parameter.markAll = true;
  } else {
    const noReadList = selectRows.filter((item) => item.readYn === false);
    if (noReadList.length === 0) {
      warnMessage({
        message: t('smart.message.smartMyMessage.message.noRead'),
      });
      return false;
    }
    parameter.markAll = false;
    parameter.messageIdList = noReadList.map((item) => item.id);
  }
  createConfirm({
    content: t('smart.message.smartMyMessage.message.confirmMarkRead'),
    onOk: async () => {
      await markAsReadApi(parameter);
      successMessage(t('smart.message.smartMyMessage.message.markReadSuccess'));
      tableApi.query();
    },
  });
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-message-smart-my-message',
  columns: getTableColumns(),
  border: true,
  height: 'auto',
  sortConfig: {
    remote: true,
  },
  columnConfig: {
    resizable: true,
  },
  checkboxConfig: {
    highlight: true,
  },
  pagerConfig: true,
  showOverflow: 'tooltip',
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    compact: true,
    actionWrapperClass: 'text-left',
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
  toolbarConfig: {
    zoom: true,
    column: true,
    refresh: true,
    buttons: [
      {
        name: t('smart.message.smartMyMessage.button.markRead'),
        customRender: 'ant',
        props: {
          preIcon: 'ant-design:highlight-outlined',
          type: 'primary',
          onClick: () => handleMarkRead(tableApi),
        },
      },
    ],
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        return pageCurrentUserMessageApi(ajaxParameter);
      },
    },
  },
});

const [RenderSystemMessageShowModal, modalApi] = useVbenModal({
  connectedComponent: SystemMessageShowModal,
});

const getActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.look'),
      onClick: () => {
        modalApi.setData({
          id: row.messageId,
        });
        modalApi.open();
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
    </SmartTable>
    <RenderSystemMessageShowModal />
  </div>
</template>

<style scoped></style>
