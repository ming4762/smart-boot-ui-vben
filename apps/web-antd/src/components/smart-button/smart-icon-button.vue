<script setup lang="ts">
import type { SmartIconButtonProps } from '../type';

import { computed, h, unref, useAttrs, useSlots } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button } from 'ant-design-vue';

interface Props extends SmartIconButtonProps {}

const props = defineProps<Props>();
const slots = useSlots();
const attrs = useAttrs();

const computedHasIcon = computed(() => {
  return slots.icon === undefined && props.preIcon !== undefined;
});

const computedSlots = computed(() => {
  let defaultSlot: any = slots.default;
  if (props.postIcon) {
    defaultSlot = () => {
      return [
        slots.default?.(),
        h(IconifyIcon, { class: 'anticon', icon: props.postIcon! }),
      ];
    };
  }
  const result: Record<string, any> = {
    ...slots,
    default: defaultSlot,
  };
  if (unref(computedHasIcon)) {
    result.icon = () =>
      h(IconifyIcon, { class: 'anticon', icon: props.preIcon! });
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
