<script setup lang="ts">
import { toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { Divider, TabPane, Tabs } from 'ant-design-vue';

import { SmartAuthButton, SmartIconButton } from '#/components';

import { useSaveConfig } from './CodeDesignPageHook';
import CodeDesignForm from './componenets/CodeDesignForm.vue';
import PageFormSetting from './componenets/PageFromSetting/PageFormSetting.vue';
import PageSearchSetting from './componenets/PageSearchSetting/PageSearchSetting.vue';
import PageTableSetting from './componenets/PageTableSetting/PageTableSetting.vue';
import TableFieldTable from './componenets/TableFieldTable/TableFieldTable.vue';
import { useProvideCodeDesignContext } from './useContext';

interface Props {
  systemId?: number | string;
  configId?: number | string;
}
const props = defineProps<Props>();

const { configId } = toRefs(props);

const router = useRouter();
const route = useRoute();

const { getTableSize } = useSizeSetting();

const { provideCodeDesignContext, getHandlerContext, contextData } =
  useProvideCodeDesignContext();
provideCodeDesignContext();

const handleReload = () => {
  getHandlerContext().loadConfigData?.();
};

const { handleSave, saveLoading } = useSaveConfig(
  configId,
  getHandlerContext,
  contextData,
  (configId) => {
    const { query, path } = route;
    router.replace({
      path,
      query: {
        ...query,
        configId,
      },
    });
  },
);
</script>

<template>
  <div class="page-container smart-code-design h-full">
    <div class="spin bg-background">
      <div class="form-container">
        <CodeDesignForm :config-id="configId" :system-id="systemId" />
        <Divider />
        <Tabs animated style="min-height: 400px">
          <TabPane
            key="1"
            force-render
            :tab="t('smart.code.views.codeManager.title.dbMessage')"
          >
            <TableFieldTable :size="getTableSize" />
          </TabPane>
          <TabPane
            key="2"
            force-render
            :tab="t('smart.code.views.codeManager.title.tableSetting')"
          >
            <PageTableSetting :size="getTableSize" />
          </TabPane>
          <TabPane
            key="3"
            force-render
            :tab="t('smart.code.views.codeManager.title.formSetting')"
          >
            <PageFormSetting :size="getTableSize" />
          </TabPane>
          <TabPane
            key="4"
            force-render
            :tab="t('smart.code.views.codeManager.title.searchSetting')"
          >
            <PageSearchSetting :size="getTableSize" />
          </TabPane>
        </Tabs>
      </div>
      <Divider />
      <div class="text-right">
        <SmartIconButton
          pre-icon="ant-design:reload-outlined"
          @click="handleReload"
        >
          {{ t('common.button.reload') }}
        </SmartIconButton>
        <SmartAuthButton
          :loading="saveLoading"
          auth="db:codeConfig:save"
          class="ml-[5px]"
          pre-icon="ant-design:save-outlined"
          type="primary"
          @click="handleSave"
        >
          {{ t('common.button.save') }}
        </SmartAuthButton>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.smart-code-design {
  :deep(.ant-divider) {
    margin: 5px 0;
  }
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
