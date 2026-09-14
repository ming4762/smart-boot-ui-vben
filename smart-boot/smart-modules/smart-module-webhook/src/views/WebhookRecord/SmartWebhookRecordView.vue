<script setup lang="ts">
import type { WebhookEvent } from '../../types/webhook';

import { ref } from 'vue';

import { ResizableLayout } from '@vben/common-ui';

import SmartWebhookDelivery from './components/WebhookDelivery/SmartWebhookDelivery.vue';
import SmartWebhookEvent from './components/WebhookEvent/SmartWebhookEvent.vue';

const selectedEvent = ref<WebhookEvent>();
</script>

<template>
  <main class="page-container h-full min-h-[640px]">
    <ResizableLayout
      class="h-full"
      direction="vertical"
      divider-size="5px"
      :first-size="50"
      resize-mode="preview"
      resizable
    >
      <template #first>
        <SmartWebhookEvent
          :selected-event="selectedEvent"
          @select="(event) => (selectedEvent = event)"
        />
      </template>
      <template #second>
        <SmartWebhookDelivery
          :event="selectedEvent"
          @clear-event="selectedEvent = undefined"
        />
      </template>
    </ResizableLayout>
  </main>
</template>
