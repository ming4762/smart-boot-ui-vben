<script setup lang="ts">
import type { PermissionId } from '@smart-module/system';

import type { ManagedClient } from './api';

import { computed, ref } from 'vue';

import { Alert, Button, Empty, Input, Spin, Tag } from 'antdv-next';

const props = defineProps<{
  clients: ManagedClient[];
  failed: boolean;
  loading: boolean;
  selectedClientId?: PermissionId;
}>();
const emit = defineEmits<{
  reload: [];
  select: [client: ManagedClient];
}>();

const keyword = ref('');
const visibleClients = computed(() =>
  props.clients.filter((client) =>
    `${client.clientName} ${client.clientCode}`
      .toLowerCase()
      .includes(keyword.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="bg-background flex h-full flex-col p-3">
    <div class="mb-3 flex items-center justify-between">
      <span class="font-medium">客户端</span>
      <Button size="small" :loading="loading" @click="emit('reload')">
        刷新
      </Button>
    </div>
    <div class="flex min-h-0 flex-1 flex-col gap-3 px-1">
      <Input
        v-model:value="keyword"
        placeholder="搜索名称或编码"
        allow-clear
        aria-label="搜索客户端"
      />
      <Spin :spinning="loading" class="min-h-0 flex-1 overflow-auto">
        <Alert v-if="failed" type="error" message="客户端加载失败，请重试" />
        <Empty
          v-else-if="!loading && !visibleClients.length"
          description="暂无客户端"
        />
        <div v-else class="space-y-2 pb-1">
          <button
            v-for="client in visibleClients"
            :key="client.clientId"
            type="button"
            class="w-full rounded border p-3 text-left transition-colors hover:bg-accent"
            :class="{
              'border-primary bg-accent': selectedClientId === client.clientId,
            }"
            :aria-pressed="selectedClientId === client.clientId"
            @click="emit('select', client)"
          >
            <div class="font-medium">
              {{ client.clientName }}
              <Tag v-if="!client.useYn">停用</Tag>
            </div>
            <div class="text-muted-foreground mt-1 break-all text-xs">
              {{ client.clientCode }}
            </div>
          </button>
        </div>
      </Spin>
    </div>
  </div>
</template>
