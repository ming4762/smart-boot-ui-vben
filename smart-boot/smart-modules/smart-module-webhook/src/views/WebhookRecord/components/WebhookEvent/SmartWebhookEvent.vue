<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import type { WebhookEvent } from '../../../../types/webhook';

import { watch } from 'vue';

import {
  SmartVxeTableAction,
  useSmartTable,
  useVbenDrawer,
} from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import { listEventApi } from '../../SmartWebhookRecordView.api';
import {
  getEventSearchSchemas,
  getEventTableColumns,
} from '../../SmartWebhookRecordView.config';
import SmartWebhookEventDetailDrawer from './SmartWebhookEventDetailDrawer.vue';

const props = defineProps<{ selectedEvent?: WebhookEvent }>();
const emit = defineEmits<{
  select: [event: WebhookEvent | undefined];
}>();

const { getTableSize } = useSizeSetting();

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  connectedComponent: SmartWebhookEventDetailDrawer,
});

const setCurrentRow = () => {
  const grid = tableApi.getGrid();
  grid?.clearCurrentRow();
  if (props.selectedEvent) {
    grid?.setCurrentRow({ id: props.selectedEvent.id });
  }
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-webhook-event',
  columns: getEventTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  showOverflow: 'tooltip',
  customConfig: { storage: true },
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'id',
  },
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
    schema: getEventSearchSchemas(),
    commonConfig: {
      labelWidth: 70,
      formItemClass: 'pb-2',
      componentProps: { style: { maxWidth: '170px' } },
    },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => listEventApi(ajaxParameter ?? {}),
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    sizeSetting: true,
    custom: true,
  },
});

watch(() => props.selectedEvent?.id, setCurrentRow);

const getActions = (row: WebhookEvent): SmartTableActionItem[] => [
  {
    label: '详情',
    preIcon: 'ant-design:bars-outlined',
    onClick: () => {
      detailDrawerApi.setData({ id: row.id });
      detailDrawerApi.open();
    },
  },
];

const handleCurrentChange = ({ row }: { row: WebhookEvent }) => {
  emit('select', row);
};
</script>

<template>
  <section
    class="flex h-full min-h-0 flex-col"
    aria-labelledby="webhook-event-title"
  >
    <div class="min-h-0 flex-1">
      <SmartTable
        :size="getTableSize as never"
        @current-change="handleCurrentChange"
        @proxy-query="setCurrentRow"
      >
        <template #table-operation="{ row }">
          <SmartVxeTableAction :actions="getActions(row)" />
        </template>
      </SmartTable>
    </div>
    <DetailDrawer />
  </section>
</template>
