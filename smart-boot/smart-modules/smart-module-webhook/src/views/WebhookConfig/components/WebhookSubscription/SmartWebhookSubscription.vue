<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import type {
  WebhookClient,
  WebhookSubscription,
} from '../../../../types/webhook';

import { watch } from 'vue';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import { Empty, Tag } from 'antdv-next';

import { getWebhookConfigStatusMeta } from '../../../../SmartWebhookConstants';
import {
  deleteSubscriptionApi,
  getSubscriptionByIdApi,
  listSubscriptionApi,
  saveSubscriptionApi,
  updateSubscriptionApi,
} from '../../SmartWebhookConfigView.api';
import {
  getSubscriptionFormSchemas,
  getSubscriptionSearchSchemas,
  getSubscriptionTableColumns,
  WebhookClientPermission,
} from '../../SmartWebhookConfigView.config';

const props = defineProps<{ client?: WebhookClient }>();

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-webhook-subscription',
  columns: getSubscriptionTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  showOverflow: 'tooltip',
  customConfig: { storage: true },
  rowConfig: { isHover: true, keyField: 'id' },
  checkboxConfig: true,
  pagerConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: { field: 'createTime', order: 'desc' },
  },
  columnConfig: { resizable: true },
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    searchWithSymbol: true,
    schema: getSubscriptionSearchSchemas(),
    commonConfig: {
      labelWidth: 80,
      formItemClass: 'pb-2',
      componentProps: { style: { maxWidth: '180px' } },
    },
  },
  addEditConfig: {
    modalConfig: { class: 'w-[720px]' },
    formConfig: { schema: getSubscriptionFormSchemas() },
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ({ ajaxParameter }) =>
        listSubscriptionApi({
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'clientId@=': props.client?.id,
          },
        }),
      getById: ({ id }) => getSubscriptionByIdApi(id),
      save: ({ body: { insertRecords, updateRecords } }) => {
        const model = {
          ...(insertRecords[0] ?? updateRecords[0]),
          clientId: props.client?.id,
        };
        return insertRecords.length > 0
          ? saveSubscriptionApi(model)
          : updateSubscriptionApi(model);
      },
      delete: ({ body: { removeRecords } }) =>
        deleteSubscriptionApi(removeRecords as WebhookSubscription[]),
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    sizeSetting: true,
    custom: true,
    buttons: [
      { code: 'ModalAdd', auth: WebhookClientPermission.save },
      { code: 'delete', auth: WebhookClientPermission.delete },
    ],
  },
});

watch(
  () => props.client?.id,
  (clientId) => {
    if (clientId) tableApi.query();
  },
);

const getActions = (row: WebhookSubscription): SmartTableActionItem[] => [
  {
    code: 'edit',
    auth: WebhookClientPermission.update,
    onClick: () => tableApi.editByRowModal(row),
  },
  {
    code: 'delete',
    auth: WebhookClientPermission.delete,
    danger: true,
    onClick: () => tableApi.deleteByRow(row),
  },
];
</script>

<template>
  <section
    class="flex h-full min-h-0 flex-col"
    aria-labelledby="webhook-subscription-title"
  >
    <div v-show="client" class="min-h-0 flex-1">
      <SmartTable :size="getTableSize as never">
        <template #table-status="{ row }">
          <Tag :color="getWebhookConfigStatusMeta(row.status).color">
            {{ getWebhookConfigStatusMeta(row.status).label }}
          </Tag>
        </template>
        <template #table-operation="{ row }">
          <SmartVxeTableAction :actions="getActions(row)" />
        </template>
      </SmartTable>
    </div>
    <div
      v-show="!client"
      class="flex min-h-0 flex-1 items-center justify-center"
    >
      <Empty description="请先从上方选择一个客户端" />
    </div>
  </section>
</template>
