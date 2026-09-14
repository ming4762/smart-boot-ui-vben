<script setup lang="ts">
import type { PermissionId } from '../../../../permission-management/types';
import FunctionGrantPanel from '../../../../permission-management/FunctionGrantPanel.vue';
import { createLocalPackageGrant } from '../../../../permission-management/local-adapters';

/** 保留既有调用参数，内部统一使用可复用功能授权树。 */
defineProps<{ tenantPackageId?: PermissionId; isSuperAdmin?: boolean }>();
const adapter = createLocalPackageGrant();
</script>

<template>
  <FunctionGrantPanel :adapter="adapter" :resource-id="tenantPackageId" :is-super-admin="isSuperAdmin" />
</template>
