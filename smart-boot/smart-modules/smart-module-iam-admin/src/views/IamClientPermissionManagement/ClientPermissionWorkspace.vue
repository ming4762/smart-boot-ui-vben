<script setup lang="ts">
import type { PermissionId } from '@smart-module/system';

import type { ManagedClient } from './api';
import type { ClientPermissionTab } from './config';

import { SysTenantSelect } from '@smart/components';
import { Empty, Tabs } from 'antdv-next';

import ClientPermissionPanels from './ClientPermissionPanels.vue';

defineProps<{
  selected?: ManagedClient;
  tabs: ClientPermissionTab[];
}>();

const activeTab = defineModel<string>('activeTab', { required: true });
const tenantId = defineModel<PermissionId | undefined>('tenantId');
</script>

<template>
  <div class="permission-container bg-background flex h-full min-w-0 flex-col">
    <Empty v-if="!selected" description="请选择客户端" class="pt-12" />
    <template v-else>
      <div class="flex min-h-11 shrink-0 flex-wrap items-center gap-3 p-[10px]">
        <div class="font-medium">{{ selected.clientName }} · 权限管理</div>
        <label
          v-if="activeTab === 'role' || activeTab === 'subscription'"
          class="flex items-center gap-2"
        >
          目标租户
          <SysTenantSelect
            v-model:value="tenantId"
            size="small"
            class="w-56"
            placeholder="请选择租户"
            allow-clear
          />
        </label>
      </div>
      <Tabs
        v-if="tabs.length"
        v-model:active-key="activeTab"
        :items="tabs"
        class="min-h-0 flex-1"
      >
        <template #contentRender="{ item }">
          <ClientPermissionPanels
            :activated="activeTab === item.key"
            :client-id="selected.clientId"
            :tenant-id="tenantId"
            :tab="String(item.key)"
          />
        </template>
      </Tabs>
      <Empty v-else description="没有可用的客户端管理权限" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.permission-container {
  :deep(.ant-tabs-body) {
    height: 100%;
  }

  :deep(.ant-tabs-content) {
    height: 100%;
  }
  :deep(.ant-tabs-nav) {
    padding: 0 10px;
  }
}
</style>
