<script setup lang="ts">
import type { SmartTableActionItem } from '#/adapter/smart-table';
import type { Recordable } from '@vben/types';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { createConfirm, successMessage } from '#/utils';
import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import SystemMessageShowModal from '../../components/SystemMessageShowModal.vue';
import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  publishApi,
  revokeApi,
} from './SmartMessageSystemListView.api';
import {
  Auth,
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SmartMessageSystemListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-message-system-list',
  columns: getTableColumns(),
  height: 'auto',
  border: true,
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
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
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
      fullscreen: true,
    },
    formConfig: {
      schema: getFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
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

const [RenderSystemMessageShowModal, modalApi] = useVbenModal({
  connectedComponent: SystemMessageShowModal,
});

const getActions = (row: Recordable<any>): SmartTableActionItem[] => {
  const actions: SmartTableActionItem[] = [];
  if (row.sendStatus === 'NO_SEND') {
    actions.push({
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
      auth: Auth.update,
    });
  }
  return actions;
};

/**
 * 发布操作
 * @param row
 */
const handlePublish = (row: any) => {
  createConfirm({
    content: t('smart.message.systemMessage.message.confirmPublish'),
    onOk: async () => {
      await publishApi([row.id]);
      successMessage(t('smart.message.systemMessage.message.publishSuccess'));
      tableApi.query();
    },
  });
};

const handleRevoke = (row: any) => {
  createConfirm({
    content: t('smart.message.systemMessage.message.confirmRevoke'),
    onOk: async () => {
      await revokeApi([row.id]);
      successMessage(t('smart.message.systemMessage.message.revokeSuccess'));
      tableApi.query();
    },
  });
};

const getDropDownAction = (row: Recordable<any>): SmartTableActionItem[] => {
  const actions: SmartTableActionItem[] = [];
  const sendStatus = row.sendStatus;
  if (sendStatus !== 'SEND') {
    actions.push({
      label: t('common.button.delete'),
      onClick: () => tableApi.deleteByRow(row),
      auth: Auth.delete,
    });
  }
  if (sendStatus === 'NO_SEND') {
    actions.push({
      label: t('common.button.publish'),
      onClick: () => handlePublish(row),
      auth: Auth.publish,
    });
  }
  if (sendStatus === 'SEND') {
    actions.push({
      label: t('common.button.revoke'),
      onClick: () => handleRevoke(row),
      auth: Auth.cancel,
    });
  }
  actions.push({
    label: t('common.button.look'),
    onClick: () => {
      modalApi.setData(row);
      modalApi.open();
    },
  });
  return actions;
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction
          :actions="getActions(row)"
          :drop-down-actions="getDropDownAction(row)"
        />
      </template>
    </SmartTable>
    <RenderSystemMessageShowModal />
  </div>
</template>

<style scoped></style>
