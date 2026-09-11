<script setup lang="ts">
import type { DescriptionsItemType } from 'antdv-next';

import type { WebhookEvent } from '../../../../types/webhook';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';

import { Descriptions } from 'antdv-next';

import { getEventByIdApi } from '../../SmartWebhookRecordView.api';

const detail = ref<WebhookEvent>();

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[900px]',
  footer: false,
  onOpenChange: async (open) => {
    if (!open) {
      detail.value = undefined;
      return;
    }
    try {
      drawerApi.setState({ loading: true });
      const { id } = drawerApi.getData() as Pick<WebhookEvent, 'id'>;
      detail.value = await getEventByIdApi(id);
    } finally {
      drawerApi.setState({ loading: false });
    }
  },
});

const descriptionItems = computed<DescriptionsItemType[]>(() => [
  {
    label: '事件 ID',
    content: detail.value?.eventId ?? '-',
    span: 2,
  },
  { label: '事件名称', content: detail.value?.eventName ?? '-' },
  { label: '事件类型', content: detail.value?.eventType ?? '-' },
  { label: '事件来源', content: detail.value?.source ?? '-' },
  { label: '事件版本', content: detail.value?.eventVersion ?? '-' },
  {
    label: '发生时间',
    content: formatDateTime(detail.value?.occurredAt) || '-',
  },
  {
    label: '受理时间',
    content: formatDateTime(detail.value?.createTime) || '-',
  },
]);

const formattedPayload = computed(() => {
  const payload = detail.value?.payload;
  if (!payload) return '-';
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch {
    return payload;
  }
});
</script>

<template>
  <Drawer title="Webhook 事件详情">
    <div class="space-y-4 p-1">
      <Descriptions
        :items="descriptionItems"
        :column="2"
        bordered
        size="small"
      />
      <section aria-labelledby="webhook-event-payload-title">
        <h3 id="webhook-event-payload-title" class="mb-2 font-medium">
          事件载荷
        </h3>
        <pre
          class="bg-muted max-h-[520px] overflow-auto rounded-md border p-4 text-xs leading-5 whitespace-pre-wrap break-all"
          >{{ formattedPayload }}</pre>
      </section>
    </div>
  </Drawer>
</template>
