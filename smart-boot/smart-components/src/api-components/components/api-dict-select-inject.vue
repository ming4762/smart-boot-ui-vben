<script setup lang="ts">
import type { SelectValue } from 'antdv-next/dist/select';

import { computed } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';
import { useInjectPageDict } from '@vben/preferences';

import { Select } from 'antdv-next';

interface Props {
  dictCode: string;
  labelWithCode?: boolean;
  numberToString?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  numberToString: false,
  labelWithCode: false,
});
const emit = defineEmits<{
  change: [value: SelectValue, ...args: any[]];
}>();
const modelValue = defineModel<SelectValue>('value');

const { pageDictRegister, pageDictLoadingRef, pageDictData } =
  useInjectPageDict();
if (pageDictRegister) {
  pageDictRegister(props.dictCode);
}

const LoadingOutlined = createIconifyIcon('ant-design:loading-outlined');

/**
 * 注入OPTIONS
 */
const computedOptions = computed(() => {
  if (!pageDictData) {
    return [];
  }
  const dictData = pageDictData.get(props.dictCode);
  if (!dictData) {
    return [];
  }
  return dictData.map((item: any) => {
    if (props.labelWithCode) {
      return {
        ...item,
        label: `${item.value}-${item.label}`,
      };
    }
    return item;
  });
});

function handleChange(value: SelectValue, ...args: any[]) {
  emit('change', value, ...args);
}
</script>

<template>
  <Select
    v-bind="$attrs"
    v-model:value="modelValue"
    :options="computedOptions"
    @change="handleChange"
  >
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template v-if="pageDictLoadingRef" #suffixIcon>
      <LoadingOutlined spin />
    </template>
    <template v-if="pageDictLoadingRef" #notFoundContent>
      <span>
        <LoadingOutlined class="mr-1" spin />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>

<style scoped></style>
