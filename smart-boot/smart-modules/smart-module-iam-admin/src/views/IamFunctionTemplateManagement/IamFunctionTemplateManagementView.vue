<script setup lang="ts">
import { onBeforeUnmount } from 'vue';

import { FunctionManagementPanel } from '@smart-module/system';

import { createIamPermissionAdapters } from '../IamClientPermissionManagement/adapters';

/** IAM后端约定使用该虚拟客户端ID标识默认功能模板。 */
const TEMPLATE_CLIENT_ID = -1;
const controller = new AbortController();
const adapter = createIamPermissionAdapters(
  TEMPLATE_CLIENT_ID,
  undefined,
  controller.signal,
).functions;

onBeforeUnmount(() => controller.abort());
</script>

<template>
  <div class="page-container h-full">
    <FunctionManagementPanel :adapter="adapter" />
  </div>
</template>
