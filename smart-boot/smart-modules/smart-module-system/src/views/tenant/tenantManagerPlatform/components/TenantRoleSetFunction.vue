<script setup lang="ts">
import type { PermissionId } from '../../../../permission-management/types';
import { computed } from 'vue';
import FunctionGrantPanel from '../../../../permission-management/FunctionGrantPanel.vue';
import { createLocalRoleGrant } from '../../../../permission-management/local-adapters';

/** 平台租户角色授权也复用同一棵功能树，租户切换重新创建适配范围。 */
const props = defineProps<{
  activated?: boolean; isSuperAdmin?: boolean; roleId?: PermissionId; tenantId?: PermissionId;
}>();
const adapter = computed(() => createLocalRoleGrant(props.tenantId));
</script>
<template>
  <FunctionGrantPanel v-if="activated !== false && tenantId !== undefined"
    :key="String(tenantId)" :adapter="adapter" :resource-id="roleId" :is-super-admin="isSuperAdmin" />
</template>
