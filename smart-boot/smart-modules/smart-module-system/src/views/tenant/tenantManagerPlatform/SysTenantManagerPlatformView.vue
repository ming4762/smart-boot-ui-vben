<script setup lang="ts">
import { ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { SmartLayoutSeparate } from '@vben/common-ui';

import { Tabs } from 'antdv-next';

import SysTenantList from './components/SysTenantList.vue';
import TenantRoleList from './components/TenantRoleList.vue';
import TenantSubscribeList from './components/TenantSubscribeList.vue';
import TenantUserList from './components/TenantUserList.vue';

const props = defineProps<{
  tenantId?: string;
}>();

const activeTableRef = ref('user');

const router = useRouter();

const currentRowRef = ref<any | null>(null);
const handleCurrentChange = (row: any) => {
  currentRowRef.value = row;
  const { path } = unref(router.currentRoute);
  router.push({
    path,
    query: {
      tenantId: row?.id,
    },
  });
};

const tabItems = [
  {
    key: 'user',
    label: '用户管理',
  },
  {
    key: 'subscribe',
    label: '订阅管理',
  },
  {
    key: 'role',
    label: '角色管理',
  },
];
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate
      class="h-full"
      layout="leftRight"
      first-size="260px"
      draggable
    >
      <template #first>
        <div class="h-full bg-background">
          <SysTenantList @current-change="handleCurrentChange" />
        </div>
      </template>
      <template #second>
        <div class="right-container smart-table-padding h-full bg-background">
          <Tabs v-model:active-key="activeTableRef" :items="tabItems">
            <template #contentRender="{ item }">
              <TenantUserList
                v-if="item.key === 'user'"
                :activated="activeTableRef === 'user'"
                :tenant-id="props.tenantId"
              />
              <TenantSubscribeList
                v-if="item.key === 'subscribe'"
                :activated="activeTableRef === 'subscribe'"
                :tenant-id="props.tenantId"
              />
              <TenantRoleList
                v-if="item.key === 'role'"
                :activated="activeTableRef === 'role'"
                :tenant-id="props.tenantId"
              />
            </template>
          </Tabs>
        </div>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style lang="less" scoped>
.right-container {
  background: hsl(var(--background-deep));
  :deep(.ant-tabs-nav-wrap) {
    padding-left: 10px;
  }
  :deep(.ant-tabs) {
    height: 100%;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
  :deep(.ant-tabs-tabpane) {
    height: 100%;
  }
  :deep(.ant-tabs-nav) {
    background: hsl(var(--background));
    margin-bottom: 0;
  }
  :deep(.ant-tabs-content-holder) {
    margin-top: 3px;
  }
}
</style>
