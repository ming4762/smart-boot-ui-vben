<script setup lang="ts">
import { createLocalFunctionAdapter } from '../../permission-management/local-adapters';
import FunctionManagementPanel from './FunctionManagementPanel.vue';

/** 独立系统入口，复用通用面板并固定为本地 Adapter。 */
const adapter = createLocalFunctionAdapter();
</script>

<template>
  <FunctionManagementPanel class="page-container" :adapter="adapter" />
</template>
