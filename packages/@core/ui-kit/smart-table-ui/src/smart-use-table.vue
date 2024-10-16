<script setup lang="ts">
import type { ExtendSmartTableApi, SmartTableProps } from './types';

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
  computed(() => unref(state).gridOptions),
);
const computedProps = computed(() => {
  return cloneDeep(mergeWithArrayOverride({}, toRaw(unref(forward))));
});
</script>

<template>
  <SmartTableRender v-bind="computedProps" />
</template>

<style scoped></style>
