<script setup lang="tsx">
import type { CodeSqlFormValues } from '../types';

import { computed, ref, unref } from 'vue';

import { Language, SmartCodeEditor } from '@vben/common-ui';

import { Tabs } from 'antdv-next';

import { generateMapperBySql } from '../CodeSqlMapperView.api';

const codeListRef = ref<any[]>([]);

const generatorCode = async (values: CodeSqlFormValues) => {
  codeListRef.value = await generateMapperBySql(values);
};

defineExpose({
  generatorCode,
});

const computedItems = computed(() => {
  return unref(codeListRef).map((item) => {
    return {
      key: item.templateId,
      label: item.templateName,
      content: () => (
        <SmartCodeEditor
          class="h-full"
          disabled={false}
          language={Language.JAVA}
          value={item.code}
        />
      ),
    };
  });
});
</script>

<template>
  <Tabs class="code-sql-generator-container" :items="computedItems" />
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
  :deep(.ant-tabs-tabpane) {
    height: 100%;
  }
}
</style>
