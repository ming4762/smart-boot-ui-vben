<script setup lang="ts">
import { createLocalRoleAdapter } from '../../permission-management/local-adapters';
import RoleManagementPanel from './RoleManagementPanel.vue';

/** 独立系统入口，复用通用面板并固定为本地 Adapter。 */
const adapter = createLocalRoleAdapter();
</script>

<template>
  <RoleManagementPanel class="page-container" :adapter="adapter" />
</template>
