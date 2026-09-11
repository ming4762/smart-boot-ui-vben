<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import type { WebhookDelivery, WebhookEvent } from '../../../../types/webhook';

import { watch } from 'vue';

import {
  SmartVxeTableAction,
  useSmartTable,
  useVbenDrawer,
} from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import { Tag } from 'antdv-next';

import { getWebhookDeliveryStatusMeta } from '../../../../SmartWebhookConstants';
import { listDeliveryApi } from '../../SmartWebhookRecordView.api';
import {
  getDeliverySearchSchemas,
  getDeliveryTableColumns,
} from '../../SmartWebhookRecordView.config';
import SmartWebhookDeliveryDetailDrawer from './SmartWebhookDeliveryDetailDrawer.vue';

const props = defineProps<{ event?: WebhookEvent }>();
const emit = defineEmits<{ clearEvent: [] }>();

const { getTableSize } = useSizeSetting();

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  connectedComponent: SmartWebhookDeliveryDetailDrawer,
});

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-webhook-delivery',
  columns: getDeliveryTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  showOverflow: 'tooltip',
  customConfig: { storage: true },
  rowConfig: { isHover: true, keyField: 'id' },
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
    schema: getDeliverySearchSchemas(),
    commonConfig: {
      labelWidth: 75,
      formItemClass: 'pb-2',
      componentProps: { style: { maxWidth: '180px' } },
    },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        const parameter = { ...ajaxParameter?.parameter };
        if (props.event?.id) {
          parameter['webhookEventId@='] = props.event.id;
        }
        return listDeliveryApi({ ...ajaxParameter, parameter });
      },
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    sizeSetting: true,
    custom: true,
  },
});

watch(
  () => props.event?.id,
  () => tableApi.query(),
);

const getActions = (row: WebhookDelivery): SmartTableActionItem[] => [
  {
    label: '详情',
    preIcon: 'ant-design:bars-outlined',
    onClick: () => {
      detailDrawerApi.setData({ id: row.id });
      detailDrawerApi.open();
    },
  },
];

const getHttpStatusColor = (status?: number) => {
  if (!status) return 'default';
  if (status >= 200 && status < 300) return 'success';
  if (status >= 400 && status < 500) return 'warning';
  return 'error';
};
</script>

<template>
  <section
    class="flex h-full min-h-0 flex-col"
    aria-labelledby="webhook-delivery-title"
  >
    <div class="min-h-0 flex-1">
      <SmartTable :size="getTableSize as never">
        <template #table-status="{ row }">
          <Tag :color="getWebhookDeliveryStatusMeta(row.status).color">
            {{ getWebhookDeliveryStatusMeta(row.status).label }}
          </Tag>
        </template>
        <template #table-http-status="{ row }">
          <Tag
            v-if="row.lastHttpStatus"
            :color="getHttpStatusColor(row.lastHttpStatus)"
          >
            {{ row.lastHttpStatus }}
          </Tag>
          <span v-else>-</span>
        </template>
        <template #table-operation="{ row }">
          <SmartVxeTableAction :actions="getActions(row)" />
        </template>
      </SmartTable>
    </div>
    <DetailDrawer />
  </section>
</template>
