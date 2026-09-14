<script setup lang="ts">
import type { PermissionId } from '../../../permission-management/types';
import FunctionGrantPanel from '../../../permission-management/FunctionGrantPanel.vue';
import { createLocalRoleGrant } from '../../../permission-management/local-adapters';

/** 保留既有调用参数，内部统一使用可复用功能授权树。 */
defineProps<{ roleId?: PermissionId; isSuperAdmin?: boolean }>();
const adapter = createLocalRoleGrant();
</script>

<template>
  <FunctionGrantPanel :adapter="adapter" :resource-id="roleId" :is-super-admin="isSuperAdmin" />
</template>
