<script setup lang="ts">
import type { PermissionId } from '@smart-module/system';

import type { ManagedClient } from './api';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useAccess } from '@vben/access';
import { ResizableLayout } from '@vben/common-ui';

import { listManagedClientsApi } from './api';
import ClientPermissionWorkspace from './ClientPermissionWorkspace.vue';
import { clientPermissionTabs } from './config';
import ManagedClientList from './ManagedClientList.vue';

/** IAM Admin 客户端集中权限管理入口。客户端变化会清空租户与面板状态。 */
const { hasAccessByAuth } = useAccess();
const clients = ref<ManagedClient[]>([]);
const selected = ref<ManagedClient>();
const tenantId = ref<PermissionId>();
const loading = ref(false);
const failed = ref(false);
const activeTab = ref('function');
const controller = new AbortController();
onBeforeUnmount(() => controller.abort());

const tabs = computed(() =>
  clientPermissionTabs.filter((tab) => hasAccessByAuth(tab.permission)),
);
/** 客户端变化销毁表单、行选择与勾选树，并重新要求选择目标租户。 */
function selectClient(client: ManagedClient) {
  if (selected.value?.clientId === client.clientId) return;
  selected.value = client;
  tenantId.value = undefined;
  activeTab.value = tabs.value[0]?.key ?? '';
}

/** 列表刷新失败时移除旧客户端，避免继续使用失效范围。 */
async function reload() {
  loading.value = true;
  failed.value = false;
  selected.value = undefined;
  tenantId.value = undefined;
  try {
    clients.value = await listManagedClientsApi(controller.signal);
    if (clients.value[0]) selectClient(clients.value[0]);
  } catch {
    clients.value = [];
    failed.value = !controller.signal.aborted;
  } finally {
    loading.value = false;
  }
}
onMounted(reload);
</script>

<template>
  <div class="page-container h-full min-h-[500px]">
    <ResizableLayout
      class="h-full"
      divider-size="5px"
      :first-size="280"
      resize-mode="preview"
      resizable
      size-unit="px"
    >
      <template #first>
        <ManagedClientList
          :clients="clients"
          :failed="failed"
          :loading="loading"
          :selected-client-id="selected?.clientId"
          @reload="reload"
          @select="selectClient"
        />
      </template>
      <template #second>
        <ClientPermissionWorkspace
          v-model:active-tab="activeTab"
          v-model:tenant-id="tenantId"
          :selected="selected"
          :tabs="tabs"
        />
      </template>
    </ResizableLayout>
  </div>
</template>
