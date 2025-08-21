<script setup lang="ts">
import type { CodeSqlFormValues } from './types';

import { unref, useTemplateRef } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';

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
    <SmartLayoutSeparate
      class="h-full"
      layout="topBottom"
      first-size="400px"
      show-divider
      draggable
    >
      <template #first>
        <CodeSqlMapperForm
          @generate="handleGenerate"
          class="bg-background h-full"
        />
      </template>
      <template #second>
        <CodeSqlGenerator ref="CodeSqlGenerator" class="bg-background h-full" />
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped></style>
