<script setup lang="ts">
import type { SmartFormProps } from './types';

import SmartFormRender from './render/smart-form-render.vue';

interface Props extends SmartFormProps {}

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <SmartFormRender v-bind="props" />
</template>

<style scoped></style>
