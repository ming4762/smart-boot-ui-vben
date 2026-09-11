<script setup lang="ts">
import type { DescriptionsItemType } from 'antdv-next';

import type { WebhookDelivery } from '../../../../types/webhook';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';

import { Descriptions, Tag } from 'antdv-next';

import { getWebhookDeliveryStatusMeta } from '../../../../SmartWebhookConstants';
import { getDeliveryByIdApi } from '../../SmartWebhookRecordView.api';

const detail = ref<WebhookDelivery>();

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[960px]',
  footer: false,
  onOpenChange: async (open) => {
    if (!open) {
      detail.value = undefined;
      return;
    }
    try {
      drawerApi.setState({ loading: true });
      const { id } = drawerApi.getData() as Pick<WebhookDelivery, 'id'>;
      detail.value = await getDeliveryByIdApi(id);
    } finally {
      drawerApi.setState({ loading: false });
    }
  },
});

const descriptionItems = computed<DescriptionsItemType[]>(() => [
  { label: '事件 ID', content: detail.value?.eventId ?? '-', span: 2 },
  { label: '客户端 ID', content: detail.value?.clientId ?? '-' },
  { label: '订阅 ID', content: detail.value?.subscriptionId ?? '-' },
  { label: '投递状态', content: detail.value?.status ?? '-' },
  { label: '尝试次数', content: detail.value?.attemptCount ?? 0 },
  { label: 'HTTP 状态', content: detail.value?.lastHttpStatus ?? '-' },
  {
    label: '创建时间',
    content: formatDateTime(detail.value?.createTime) || '-',
  },
  {
    label: '更新时间',
    content: formatDateTime(detail.value?.updateTime) || '-',
  },
  {
    label: '下次重试',
    content: formatDateTime(detail.value?.nextRetryAt) || '-',
  },
  {
    label: '成功时间',
    content: formatDateTime(detail.value?.successTime) || '-',
  },
  { label: '锁定节点', content: detail.value?.lockedBy ?? '-' },
  {
    label: '锁定时间',
    content: formatDateTime(detail.value?.lockedAt) || '-',
  },
  { label: '回调地址', content: detail.value?.callbackUrl ?? '-', span: 2 },
]);

const statusMeta = computed(() =>
  getWebhookDeliveryStatusMeta(detail.value?.status),
);
</script>

<template>
  <Drawer title="Webhook 投递详情">
    <div class="space-y-4 p-1">
      <Descriptions :items="descriptionItems" :column="2" bordered size="small">
        <template #contentRender="{ index, item }">
          <Tag v-if="index === 3" :color="statusMeta.color">
            {{ statusMeta.label }}
          </Tag>
          <span v-else-if="index === 4" class="font-mono tabular-nums">
            {{ item.content }}
          </span>
        </template>
      </Descriptions>

      <section aria-labelledby="webhook-response-title">
        <h3 id="webhook-response-title" class="mb-2 font-medium">响应内容</h3>
        <pre
          class="bg-muted max-h-52 overflow-auto rounded-md border p-4 text-xs leading-5 whitespace-pre-wrap break-all"
          >{{ detail?.responseBody || '-' }}</pre>
      </section>

      <section aria-labelledby="webhook-error-title">
        <h3 id="webhook-error-title" class="mb-2 font-medium">最后一次错误</h3>
        <pre
          class="bg-muted max-h-52 overflow-auto rounded-md border p-4 text-xs leading-5 whitespace-pre-wrap break-all"
          >{{ detail?.lastError || '-' }}</pre>
      </section>
    </div>
  </Drawer>
</template>
