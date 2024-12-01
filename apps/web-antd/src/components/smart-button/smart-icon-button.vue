<script setup lang="ts">
import type { SmartIconButtonProps } from '../type';

import { computed, h, unref, useAttrs, useSlots } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { Button } from 'ant-design-vue';

interface Props extends SmartIconButtonProps {}

const props = defineProps<Props>();
const slots = useSlots();
const attrs = useAttrs();

const computedHasIcon = computed(() => {
  return slots.icon === undefined && props.preIcon !== undefined;
});

const computedSlots = computed(() => {
  const result: Record<string, any> = {
    ...slots,
  };
  if (unref(computedHasIcon)) {
    result.icon = () =>
      h(createIconifyIcon(props.preIcon!), { class: 'anticon' });
  }
  return result;
});

const RenderFunction = () => {
  return h(Button, { ...props, ...attrs }, { ...unref(computedSlots) });
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped></style>
