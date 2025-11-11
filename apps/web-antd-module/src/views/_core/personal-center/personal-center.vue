<script setup lang="ts">
import { $t as t } from '@vben/locales';

import { TabPane, Tabs } from 'ant-design-vue';

// import BasicInfo from './components/basic-info.vue';
import SystemSetting from './components/system-setting.vue';
</script>

<template>
  <div class="page-container h-full">
    <div class="bg-background tab-container h-full">
      <Tabs tab-position="left" class="h-full">
        <!--        <TabPane-->
        <!--          :tab="t('ui.widgets.personalCenter.basicInfo.title')"-->
        <!--          key="basicInfo"-->
        <!--        >-->
        <!--          <BasicInfo />-->
        <!--        </TabPane>-->
        <TabPane
          :tab="t('ui.widgets.personalCenter.systemSetting.title')"
          key="systemSetting"
        >
          <SystemSetting />
        </TabPane>
        <!--        <TabPane :tab="t('ui.widgets.personalCenter.authSetting')" key="3">-->
        <!--          待完善-->
        <!--        </TabPane>-->
      </Tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab-container {
  padding: 5px;
  :deep(.ant-tabs-tab-active) {
    background-color: hsl(var(--primary) / 0.15);
  }
  :where(.dark, .dark *) :deep(.ant-tabs-tab-active) {
    background-color: hsl(var(--accent));
  }
  :deep(.ant-tabs-nav) {
    width: 220px;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
}
</style>
