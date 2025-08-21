<script setup lang="ts">
import type { CodeSqlFormValues } from '../types';

import { unref } from 'vue';

import { useSizeSetting } from '@vben/hooks';

import { useVbenForm } from '#/adapter/form';

import { getSqlMapperFormSchemas } from '../CodeSqlMapperView.config';

const emit = defineEmits<{
  (e: 'generate', values: CodeSqlFormValues): void;
}>();

const { getButtonSize, getFormSize } = useSizeSetting();

const [Form] = useVbenForm({
  schema: getSqlMapperFormSchemas(),
  commonConfig: {
    componentProps: {
      size: unref(getFormSize),
    },
    labelWidth: 90,
  },
  wrapperClass: 'grid-cols-5',
  actionPosition: 'left',
  actionLayout: 'inline',
  resetButtonOptions: {
    size: unref(getButtonSize),
    show: false,
  },
  submitButtonOptions: {
    size: unref(getButtonSize),
    content: '解析并生成',
  },
  handleSubmit: (values) => {
    emit('generate', values as CodeSqlFormValues);
  },
});
</script>

<template>
  <div class="p-[5px]">
    <Form />
  </div>
</template>

<style scoped></style>
