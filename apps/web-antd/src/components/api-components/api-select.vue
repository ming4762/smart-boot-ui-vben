<script lang="ts" setup>
import type { AnyFunction, Recordable } from '@vben/types';
import type { SelectValue } from 'ant-design-vue/es/select';

import { computed, ref, unref, watch } from 'vue';

import { useRuleFormItem } from '@vben/hooks';
import { createIconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';
import { deepEqual, isFunction, omit } from '@vben/utils';

import { Select } from 'ant-design-vue';

type OptionsItem = {
  [name: string]: any;
  disabled?: boolean;
  label?: string;
  value?: string;
};

interface Props {
  afterFetch?: AnyFunction<any, any>;
  alwaysLoad?: boolean;
  api?: (arg?: any) => Promise<OptionsItem[] | Recordable<any>>;
  beforeFetch?: AnyFunction<any, any>;
  immediate?: boolean;
  labelField?: string;
  labelWithCode?: boolean;
  numberToString?: boolean;
  options?: OptionsItem[];
  params?: Recordable<any>;
  resultField?: string;
  value?: SelectValue;
  valueField?: string;
}

defineOptions({ name: 'ApiSelect', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  resultField: '',
  labelField: 'label',
  valueField: 'value',
  immediate: true,
  alwaysLoad: false,
  options: () => [],
  value: undefined,
  params: () => ({}),
  beforeFetch: undefined,
  afterFetch: undefined,
  api: undefined,
});

const emit = defineEmits(['optionsChange', 'change', 'update:value']);

const LoadingOutlined = createIconifyIcon('ant-design:loading-outlined');

const optionsRef = ref<OptionsItem[]>([]);

const loading = ref(false);
// 首次是否加载过了
const isFirstLoaded = ref(false);
const emitData = ref<OptionsItem[]>([]);

// Embedded in the form, just use the hook binding to perform form verification
const [state] = useRuleFormItem(props, 'value', 'change', emitData);

const getOptions = computed(() => {
  const { labelField, valueField, numberToString } = props;

  const data = unref(optionsRef)?.reduce((prev, next: any) => {
    if (next) {
      const value = next[valueField];
      prev.push({
        ...omit(next, [labelField, valueField]),
        label: props.labelWithCode
          ? `${value}-${next[labelField]}`
          : next[labelField],
        value: numberToString ? `${value}` : value,
      });
    }
    return prev;
  }, [] as OptionsItem[]);
  return data.length > 0 ? data : props.options;
});

watch(
  () => state.value,
  (v) => {
    emit('update:value', v);
  },
);
watch(
  () => props.params,
  (value, oldValue) => {
    if (deepEqual(value, oldValue)) return;
    fetch();
  },
  { deep: true, immediate: props.immediate },
);

async function fetch() {
  let { api, beforeFetch, afterFetch, params, resultField } = props;
  if (!api || !isFunction(api) || loading.value) return;
  optionsRef.value = [];
  try {
    loading.value = true;
    if (beforeFetch && isFunction(beforeFetch)) {
      params = (await beforeFetch(params)) || params;
    }
    let res = await api(params);
    if (afterFetch && isFunction(afterFetch)) {
      res = (await afterFetch(res)) || res;
    }
    isFirstLoaded.value = true;
    if (Array.isArray(res)) {
      optionsRef.value = res;
      emitChange();
      return;
    }
    if (resultField) {
      optionsRef.value = res[resultField] || [];
    }
    emitChange();
  } catch (error) {
    console.warn(error);
    // reset status
    isFirstLoaded.value = false;
  } finally {
    loading.value = false;
  }
}

async function handleFetch(visible: boolean) {
  if (visible) {
    if (props.alwaysLoad) {
      await fetch();
    } else if (!props.immediate && !unref(isFirstLoaded)) {
      await fetch();
    }
  }
}

function emitChange() {
  emit('optionsChange', unref(getOptions));
}

function handleChange(_: any, ...args: any[]) {
  emitData.value = args;
}
</script>
<template>
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    v-model:value="state"
    :options="getOptions"
    @change="handleChange"
  >
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template v-if="loading" #suffixIcon>
      <LoadingOutlined spin />
    </template>
    <template v-if="loading" #notFoundContent>
      <span>
        <LoadingOutlined class="mr-1" spin />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
