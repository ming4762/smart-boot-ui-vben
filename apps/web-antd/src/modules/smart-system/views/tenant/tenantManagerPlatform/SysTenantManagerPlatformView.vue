<script setup lang="ts">
import { ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { SmartLayoutSeparate } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

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
  if (row && row.platformYn && unref(activeTableRef) === 'subscribe') {
    activeTableRef.value = 'user';
  }
  const { path } = unref(router.currentRoute);
  router.push({
    path,
    query: {
      tenantId: row?.id,
    },
  });
};
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
        <div class="bg-background h-full">
          <SysTenantList @current-change="handleCurrentChange" />
        </div>
      </template>
      <template #second>
        <div class="right-container smart-table-padding bg-background h-full">
          <Tabs v-model:active-key="activeTableRef">
            <TabPane key="user" tab="用户管理">
              <TenantUserList
                :activated="activeTableRef === 'user'"
                :tenant-id="props.tenantId"
              />
            </TabPane>
            <TabPane key="subscribe" tab="订阅管理">
              <TenantSubscribeList
                :activated="activeTableRef === 'subscribe'"
                :tenant-id="props.tenantId"
              />
            </TabPane>
            <TabPane key="role" tab="角色管理">
              <TenantRoleList
                :activated="activeTableRef === 'role'"
                :tenant-id="props.tenantId"
              />
            </TabPane>
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
  :deep(.ant-tabs-nav) {
    background: hsl(var(--background));
    margin-bottom: 0;
  }
  :deep(.ant-tabs-content-holder) {
    margin-top: 3px;
  }
}
</style>
