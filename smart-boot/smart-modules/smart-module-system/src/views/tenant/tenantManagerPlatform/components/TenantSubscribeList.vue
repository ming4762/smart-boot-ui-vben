<script setup lang="ts">
import type { SysTenantProps } from '../SysTenantManagerPlatformView.confg';
import TenantSubscriptionManagementPanel from './TenantSubscriptionManagementPanel.vue';

/** 本地租户订阅入口，保持原来的 tenantId 与激活参数。 */
defineProps<SysTenantProps>();
</script>
<template>
  <TenantSubscriptionManagementPanel :tenant-id="tenantId" :activated="activated" />
</template>
