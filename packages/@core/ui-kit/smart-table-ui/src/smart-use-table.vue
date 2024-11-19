<script setup lang="tsx">
import type {
  ExtendSmartTableApi,
  SmartTableActions,
  SmartTableProps,
  SmartTableRenderProps,
} from './types';

import { computed, toRaw, unref, useSlots } from 'vue';

import { useForwardPriorityValues } from '@vben-core/composables';
import { cloneDeep, mergeWithArrayOverride } from '@vben-core/shared/utils';

import SmartTableRender from './render/smart-table-render.vue';

interface Props extends SmartTableProps {
  api: ExtendSmartTableApi;
}

const props = withDefaults(defineProps<Props>(), {});

const slots = useSlots();

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

const slotNameList = computed(() => {
  return Object.keys(slots);
});
</script>

<template>
  <SmartTableRender v-bind="computedProps" @register="handleRegister">
    <template
      v-for="slotName in slotNameList"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
  </SmartTableRender>
</template>

<style scoped></style>
