<script setup lang="tsx">
import type {
  ExtendSmartTableApi,
  SmartTableActions,
  SmartTableProps,
  SmartTableRenderProps,
} from './types';

import { computed, toRaw, unref } from 'vue';

import { useForwardPriorityValues } from '@vben-core/composables';
import { cloneDeep, mergeWithArrayOverride } from '@vben-core/shared/utils';

import SmartTableRender from './render/smart-table-render.vue';

interface Props extends SmartTableProps {
  api: ExtendSmartTableApi;
}

const props = withDefaults(defineProps<Props>(), {});

const state = props.api?.useStore?.();
const forward = useForwardPriorityValues(
  props,
  computed(() => unref(state)),
);
const computedProps = computed<SmartTableRenderProps>(() => {
  return cloneDeep(mergeWithArrayOverride({}, toRaw(unref(forward))));
});

const handleRegister = (tableAction: SmartTableActions) => {
  props.api?.mount(tableAction.getGrid(), tableAction.getSearchForm());
};
</script>

<template>
  <SmartTableRender v-bind="computedProps" @register="handleRegister" />
</template>

<style scoped></style>
