<script setup lang="ts">
import { ResizableLayout } from '@vben/common-ui';

import SsoClientList from './components/IamClientList.vue';
import SsoClientUserList from './components/IamClientUserList.vue';

interface Props {
  clientId?: number | string;
  clientType?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <ResizableLayout
    class="page-container h-full"
    divider-size="5px"
    :first-size="340"
    :resizable="false"
    show-divider
    :show-handle="false"
    size-unit="px"
  >
    <template #first>
      <SsoClientList :client-id="props.clientId" />
    </template>
    <template #second>
      <SsoClientUserList
        :client-id="props.clientId"
        :client-type="props.clientType"
      />
    </template>
  </ResizableLayout>
</template>

<style scoped></style>
