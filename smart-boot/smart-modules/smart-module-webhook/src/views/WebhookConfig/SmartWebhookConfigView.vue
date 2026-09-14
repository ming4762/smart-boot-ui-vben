<script setup lang="ts">
import type { WebhookClient } from '../../types/webhook';

import { ref } from 'vue';

import { ResizableLayout } from '@vben/common-ui';

import SmartWebhookClient from './components/WebhookClient/SmartWebhookClient.vue';
import SmartWebhookSubscription from './components/WebhookSubscription/SmartWebhookSubscription.vue';

const selectedClient = ref<WebhookClient>();
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
        <SmartWebhookClient
          :selected-client="selectedClient"
          @select="(client) => (selectedClient = client)"
        />
      </template>
      <template #second>
        <SmartWebhookSubscription :client="selectedClient" />
      </template>
    </ResizableLayout>
  </main>
</template>
