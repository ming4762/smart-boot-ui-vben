<script setup lang="ts">
import { computed } from 'vue';

import { useInjectPageDict } from '@vben/preferences';

import { ApiServiceEnum, requestClient } from '#/api/request';

import ApiSelect from './api-select.vue';
import ApiDictSelectInject from './components/api-dict-select-inject.vue';

interface Props {
  dictCode: string;
}

const props = defineProps<Props>();

const { pageDictRegisterIdent } = useInjectPageDict();
/**
 * 是否有注入
 */
const computedHasProvider = computed(() => {
  return pageDictRegisterIdent;
});

const api = () => {
  return requestClient.post(
    'sys/dict/listItemByCode',
    { value: props.dictCode },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
</script>

<template>
  <ApiDictSelectInject
    v-if="computedHasProvider"
    v-bind="$attrs"
    :dict-code="dictCode"
  />
  <ApiSelect
    v-else
    v-bind="$attrs"
    :api="api"
    label-field="dictItemName"
    value-field="dictItemCode"
  />
</template>

<style scoped></style>
