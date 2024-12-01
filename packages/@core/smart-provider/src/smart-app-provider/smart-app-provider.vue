<script setup lang="ts">
import type { SmartAppProviderProps } from '../types';

import { useSlots } from 'vue';

import { useProviderSmartAppContext } from './useSmartAppProvider';

interface Props extends SmartAppProviderProps {}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<Props>();

const slots = useSlots();

useProviderSmartAppContext(props);

const RenderFunction = () => slots.default?.();
</script>

<template>
  <RenderFunction />
</template>
