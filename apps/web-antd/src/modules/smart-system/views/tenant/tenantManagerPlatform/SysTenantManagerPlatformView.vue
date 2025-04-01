<script setup lang="ts">
import { ref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

import SysTenantList from './components/SysTenantList.vue';
import TenantSubscribeList from './components/TenantSubscribeList.vue';
import TenantUserList from './components/TenantUserList.vue';

const currentRowRef = ref<any | null>(null);
const handleCurrentChange = ({ row }: any) => {
  currentRowRef.value = row;
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
        <div class="right-container bg-background ml-[5px] h-full">
          <Tabs>
            <TabPane key="user" tab="用户管理">
              <TenantUserList :tenant-id="currentRowRef?.id" />
            </TabPane>
            <TabPane key="subscribe" tab="订阅管理">
              <TenantSubscribeList :tenant-id="currentRowRef?.id" />
            </TabPane>
            <TabPane key="role" tab="角色管理" />
          </Tabs>
        </div>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style lang="less" scoped>
.right-container {
  :deep(.ant-tabs-nav-wrap) {
    padding-left: 10px;
  }
  :deep(.ant-tabs) {
    height: 100%;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
}
</style>
