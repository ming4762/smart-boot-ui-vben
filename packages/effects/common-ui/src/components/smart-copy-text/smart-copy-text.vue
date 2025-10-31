<script setup lang="tsx">
import type { CopyTextIconEmits, CopyTextProps } from './types';

import { computed, unref, useSlots } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { useClipboard } from '@vueuse/core';

const props = withDefaults(defineProps<CopyTextProps>(), {
  iconPosition: 'end',
  margin: 3,
  showMode: 'always',
  noTextVisible: false,
  icon: 'ant-design:copy-outlined',
});

const emit = defineEmits<CopyTextIconEmits>();

const slots = useSlots();

const { copy } = useClipboard({ legacy: true });

/**
 * 图标样式
 */
const computedIconContainerClass = computed(() => {
  return [
    'flex',
    'items-center',
    'cursor-pointer',
    ...unref(computedShowClass),
  ];
});

const computedIconContainerStyle = computed(() => {
  const marginStr = `${props.margin}px`;
  if (props.iconPosition === 'left') {
    return { 'margin-right': marginStr };
  }
  if (props.iconPosition === 'end') {
    return { 'margin-left': marginStr };
  }
  return {};
});

const computedShowClass = computed(() => {
  if (props.showMode === 'always') {
    return ['hover:opacity-70'];
  }
  return [
    'opacity-0',
    'group-hover:opacity-100',
    'transition-opacity',
    'duration-100',
  ];
});

/**
 * 复制文本
 */
const handleCopy = () => {
  copy(props.text);
  emit('copy', props.text);
};

const computedIconVisible = computed(() => {
  if (props.text && props.text.trim()) {
    return true;
  }
  return props.noTextVisible;
});

/**
 * 复制文本图标
 * @constructor
 */
const CopyIcon = createIconifyIcon(props.icon);
const CopyTextIcon = () => {
  if (!unref(computedIconVisible)) {
    return null;
  }
  return (
    <div
      class={unref(computedIconContainerClass)}
      onClick={handleCopy}
      style={unref(computedIconContainerStyle)}
    >
      {slots.icon ? slots.icon() : <CopyIcon />}
    </div>
  );
};
</script>

<template>
  <div class="group flex">
    <CopyTextIcon v-if="iconPosition === 'left'" />
    <span>{{ text }}</span>
    <CopyTextIcon v-if="iconPosition === 'end'" />
    <CopyTextIcon class="ml-auto" v-if="iconPosition === 'right'" />
  </div>
</template>

<style scoped></style>
