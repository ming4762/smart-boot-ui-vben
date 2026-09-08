<script setup lang="ts">
import type { PermissionId } from '@smart-module/system';

import { computed, onBeforeUnmount, ref, shallowRef, toRef } from 'vue';

import { useTabLazy } from '@vben/hooks';

import {
  FunctionManagementPanel,
  RoleManagementPanel,
  TenantPackageManagementPanel,
  TenantSubscriptionManagementPanel,
} from '@smart-module/system';
import { Empty } from 'antdv-next';

import { createIamPermissionAdapters } from './adapters';

/** 每个 Tab 保留实例，仅在激活且自身请求范围变化时切换请求范围。 */
const props = defineProps<{
  activated: boolean;
  clientId: PermissionId;
  tab: string;
  tenantId?: PermissionId;
}>();
const activated = toRef(props, 'activated');
const scopeTenantId = computed(() =>
  props.tab === 'role' || props.tab === 'subscription'
    ? props.tenantId
    : undefined,
);
const scopeKey = computed(
  () => `${props.clientId}:${scopeTenantId.value ?? 'none'}`,
);
const loadedScopeKey = ref('');
const loadedTenantId = shallowRef<PermissionId>();
const adapters = shallowRef<ReturnType<typeof createIamPermissionAdapters>>();
let controller: AbortController | undefined;

function loadScope() {
  controller?.abort();
  controller = new AbortController();
  adapters.value = createIamPermissionAdapters(
    props.clientId,
    scopeTenantId.value,
    controller.signal,
  );
  loadedTenantId.value = scopeTenantId.value;
  loadedScopeKey.value = scopeKey.value;
}

useTabLazy(scopeKey, activated, loadScope, { immediate: true });
onBeforeUnmount(() => controller?.abort());
</script>

<template>
  <FunctionManagementPanel
    v-if="adapters && tab === 'function'"
    :key="`function:${loadedScopeKey}`"
    :adapter="adapters.functions"
  />
  <TenantPackageManagementPanel
    v-else-if="adapters && tab === 'package'"
    :key="`package:${loadedScopeKey}`"
    :adapter="adapters.packages"
  />
  <Empty
    v-else-if="adapters && loadedTenantId == null"
    description="请先选择目标租户"
    class="pt-12"
  />
  <RoleManagementPanel
    v-else-if="adapters && tab === 'role'"
    :key="`role:${loadedScopeKey}`"
    :adapter="adapters.roles"
  />
  <TenantSubscriptionManagementPanel
    v-else-if="adapters && tab === 'subscription'"
    :key="`subscription:${loadedScopeKey}`"
    :adapter="adapters.subscriptions"
    :tenant-id="loadedTenantId"
    :activated="false"
  />
</template>
