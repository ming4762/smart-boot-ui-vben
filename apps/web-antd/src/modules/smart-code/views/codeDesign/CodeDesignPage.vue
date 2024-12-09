<script setup lang="ts">
import { ref } from 'vue';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { Divider, Spin, TabPane, Tabs } from 'ant-design-vue';

import CodeDesignForm from './componenets/CodeDesignForm.vue';
import PageTableSetting from './componenets/PageTableSetting/PageTableSetting.vue';
import TableFieldTable from './componenets/TableFieldTable/TableFieldTable.vue';
import { useProvideCodeDesignContext } from './useContext';

interface Props {
  systemId?: number;
  configId?: number;
}
defineProps<Props>();

const { getTableSize } = useSizeSetting();

const pageLoading = ref(false);

const { provideCodeDesignContext } = useProvideCodeDesignContext();
provideCodeDesignContext();
</script>

<template>
  <div class="page-container smart-code-design h-full">
    <div class="spin bg-background">
      <div class="form-container">
        <Spin :spinning="pageLoading">
          <CodeDesignForm :system-id="systemId" />
          <Divider />
          <Tabs animated style="min-height: 400px">
            <TabPane
              key="1"
              :tab="t('smart.code.views.codeManager.title.dbMessage')"
            >
              <TableFieldTable :size="getTableSize" />
            </TabPane>
            <TabPane
              key="2"
              :tab="t('smart.code.views.codeManager.title.tableSetting')"
            >
              <PageTableSetting :size="getTableSize" />
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.smart-code-design {
  .spin {
    height: 100%;
    padding: 10px;
  }
  .form-container {
    height: calc(100% - 42px);
    overflow: auto;
  }
}
</style>
