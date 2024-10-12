<script setup lang="ts">
import type { ExtendSmartTableApi, SmartTableProps } from './types';

import { useForwardPriorityValues } from '@vben-core/composables';

import SmartTableRender from './render/smart-table-render.vue';

interface Props extends SmartTableProps {
  api: ExtendSmartTableApi;
}

const props = defineProps<Props>();

const state = props.api?.useStore?.();

const forward = useForwardPriorityValues(props, state);
</script>

<template>
  <SmartTableRender v-bind="forward" />
</template>

<style scoped></style>
