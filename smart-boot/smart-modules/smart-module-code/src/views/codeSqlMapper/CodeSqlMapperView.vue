<script setup lang="ts">
import type { CodeSqlFormValues } from './types';

import { unref, useTemplateRef } from 'vue';

import { ResizableLayout } from '@vben/common-ui';

import CodeSqlGenerator from './components/CodeSqlGenerator.vue';
import CodeSqlMapperForm from './components/CodeSqlMapperForm.vue';

const sqlGeneratorRef =
  useTemplateRef<typeof CodeSqlGenerator>('CodeSqlGenerator');

const handleGenerate = (values: CodeSqlFormValues) => {
  unref(sqlGeneratorRef)?.generatorCode(values);
};
</script>

<template>
  <div class="page-container h-full">
    <ResizableLayout
      class="h-full"
      direction="vertical"
      divider-size="5px"
      :first-size="400"
      resize-mode="preview"
      resizable
      show-divider
      size-unit="px"
    >
      <template #first>
        <CodeSqlMapperForm
          @generate="handleGenerate"
          class="h-full bg-background"
        />
      </template>
      <template #second>
        <CodeSqlGenerator ref="CodeSqlGenerator" class="h-full bg-background" />
      </template>
    </ResizableLayout>
  </div>
</template>

<style scoped></style>
