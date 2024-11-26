<script setup lang="ts">
import type {
  SmartTableSelectModalProps,
  SmartTableSelectProps,
} from '../type';

import { computed, useAttrs } from 'vue';

import SmartTableSelect from './smart-table-select.vue';

type Props = {
  parameterHandler?: (parameter?: Record<string, any>) => Record<string, any>;
} & SmartTableSelectModalProps &
  SmartTableSelectProps;

const props = defineProps<Props>();
const attrs = useAttrs();

const tableProps = {};

const defaultProps = {
  title: '选择人员',
  labelField: 'fullName',
  valueField: 'userId',
  multiple: true,
  listApi: listUserById,
  tableProps,
  defaultFullscreen: true,
};

const computedProps = computed(() => {
  return {
    ...defaultProps,
    ...props,
    ...attrs,
  };
});
</script>

<template>
  <SmartTableSelect v-bind="computedProps" />
</template>

<style scoped></style>
