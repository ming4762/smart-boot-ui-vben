<script setup lang="ts">
import { SmartLayoutSeparate } from '@vben/common-ui';

import SsoClientList from './components/SsoClientList.vue';
import SsoClientUserList from './components/SsoClientUserList.vue';

interface Props {
  clientId?: number | string;
  clientType?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <SmartLayoutSeparate
    class="page-container h-full"
    first-size="340px"
    layout="leftRight"
    show-divider
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
  </SmartLayoutSeparate>
</template>

<style scoped></style>
