<script setup lang="ts">
import type { CodeSqlFormValues } from '../types';

import { ref } from 'vue';

import { Language, SmartCodeEditor } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

import { generateMapperBySql } from '../CodeSqlMapperView.api';

const codeListRef = ref<any>([]);

const generatorCode = async (values: CodeSqlFormValues) => {
  codeListRef.value = await generateMapperBySql(values);
};

defineExpose({
  generatorCode,
});
</script>

<template>
  <Tabs class="code-sql-generator-container">
    <TabPane
      v-for="item in codeListRef"
      :key="item.templateId"
      :tab="item.templateName"
    >
      <SmartCodeEditor
        class="h-full"
        :language="Language.JAVA"
        :value="item.code"
        disabled
      />
    </TabPane>
  </Tabs>
</template>

<style lang="less" scoped>
.code-sql-generator-container {
  :deep(.ant-tabs-nav-wrap) {
    margin: 0 5px;
  }
  :deep(.ant-tabs-content-holder) {
    padding: 0 5px;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
}
</style>
