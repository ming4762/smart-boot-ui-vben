<script setup lang="ts">
import type { SelectValue } from 'ant-design-vue/es/select';

import { computed, ref, watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';
import { useInjectPageDict } from '@vben/preferences';

import { Select } from 'ant-design-vue';

import { useRuleFormItem } from '../hooks/useFormItem';

type OptionsItem = {
  [name: string]: any;
  disabled?: boolean;
  label?: string;
  value?: string;
};

interface Props {
  dictCode: string;
  value?: SelectValue;
  numberToString?: boolean;
  labelWithCode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  numberToString: false,
  labelWithCode: false,
  value: undefined,
});
const emit = defineEmits(['change', 'update:value']);

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

const emitData = ref<OptionsItem[]>([]);
const [state] = useRuleFormItem(props, 'value', 'change', emitData);
watch(
  () => state.value,
  (v) => {
    emit('update:value', v);
  },
);

function handleChange(_: any, ...args: any[]) {
  emitData.value = args;
}
</script>

<template>
  <Select
    v-bind="$attrs"
    v-model:value="state"
    :option="computedOptions"
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
