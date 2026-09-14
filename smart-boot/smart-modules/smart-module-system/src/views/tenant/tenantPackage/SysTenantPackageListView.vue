<script setup lang="ts">
import { createLocalPackageAdapter } from '../../../permission-management/local-adapters';
import TenantPackageManagementPanel from './TenantPackageManagementPanel.vue';

/** 独立系统入口，复用通用面板并固定为本地 Adapter。 */
const adapter = createLocalPackageAdapter();
</script>

<template>
  <TenantPackageManagementPanel :adapter="adapter" />
</template>
