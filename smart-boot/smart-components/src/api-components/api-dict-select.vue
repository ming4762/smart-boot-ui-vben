<script setup lang="ts">
import { computed } from 'vue';

import { ApiComponent } from '@vben/common-ui';
import { useInjectPageDict } from '@vben/preferences';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { Select } from 'ant-design-vue';

import ApiDictSelectInject from './components/api-dict-select-inject.vue';

interface Props {
  dictCode: string;
}

defineOptions({
  name: 'ApiDictSelect',
});

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
  <ApiComponent
    v-else
    v-bind="$attrs"
    :api="api"
    :component="Select"
    label-field="dictItemName"
    loading-slot="suffixIcon"
    model-prop-name="value"
    value-field="dictItemCode"
    visible-event="onDropdownVisibleChange"
  />
</template>

<style scoped></style>
