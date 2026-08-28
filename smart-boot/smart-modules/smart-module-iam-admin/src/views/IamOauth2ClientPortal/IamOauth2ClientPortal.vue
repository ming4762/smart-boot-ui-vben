<script setup lang="ts">
import type { IamOauth2ClientPortalItem } from './IamOauth2ClientPortal.api';

import { computed, onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Empty, InputSearch, Spin } from 'antdv-next';

import { listPortalClientApi } from './IamOauth2ClientPortal.api';

defineOptions({
  name: 'IamOauth2ClientPortal',
});

const clientList = ref<IamOauth2ClientPortalItem[]>([]);
const loading = ref(false);
const searchValue = ref('');

const showSearch = computed(() => clientList.value.length > 12);
const filteredClientList = computed(() => {
  const keyword = searchValue.value.trim().toLocaleLowerCase();
  if (!keyword) {
    return clientList.value;
  }
  return clientList.value.filter((client) =>
    [client.clientName, client.remark]
      .filter(Boolean)
      .some((value) => value?.toLocaleLowerCase().includes(keyword)),
  );
});

const loadClientList = async () => {
  loading.value = true;
  try {
    clientList.value = await listPortalClientApi();
  } finally {
    loading.value = false;
  }
};

onMounted(loadClientList);
</script>

<template>
  <div class="page-container h-full overflow-auto">
    <section
      aria-labelledby="application-portal-title"
      class="bg-background min-h-full rounded-lg p-4 sm:p-6"
    >
      <header
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div class="flex items-center gap-3">
            <h1
              id="application-portal-title"
              class="text-foreground text-2xl font-semibold tracking-tight"
            >
              应用门户
            </h1>
            <span
              v-if="!loading"
              class="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium"
            >
              {{ clientList.length }} 个应用
            </span>
          </div>
          <p class="text-muted-foreground mt-2 text-sm">
            选择应用，在新标签页中打开
          </p>
        </div>

        <InputSearch
          v-if="showSearch"
          v-model:value="searchValue"
          allow-clear
          aria-label="搜索应用"
          class="w-full sm:w-80"
          placeholder="搜索应用名称或备注"
        />
      </header>

      <Spin :spinning="loading">
        <div
          v-if="filteredClientList.length > 0"
          class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <a
            v-for="client in filteredClientList"
            :key="client.id"
            :aria-label="`打开${client.clientName}`"
            :href="client.initiateLoginUri"
            class="border-border bg-card text-card-foreground focus-visible:ring-ring group flex min-h-36 cursor-pointer items-start gap-4 rounded-xl border p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span
              aria-hidden="true"
              class="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg"
            >
              <IconifyIcon class="size-6" icon="lucide:app-window" />
            </span>

            <span class="min-w-0 flex-1">
              <span class="flex items-start justify-between gap-3">
                <span
                  :title="client.clientName"
                  class="truncate text-base font-semibold"
                >
                  {{ client.clientName }}
                </span>
                <IconifyIcon
                  aria-hidden="true"
                  class="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  icon="lucide:external-link"
                />
              </span>
              <span
                :title="client.remark || '点击卡片访问该应用'"
                class="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6"
              >
                {{ client.remark || '点击卡片访问该应用' }}
              </span>
            </span>
          </a>
        </div>

        <Empty
          v-else-if="!loading"
          :description="
            searchValue
              ? '未找到匹配的应用'
              : '暂无可访问的应用，请联系管理员授权'
          "
          class="py-20"
        />
      </Spin>
    </section>
  </div>
</template>
