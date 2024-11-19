<script setup lang="ts">
import { computed, h, unref, useAttrs, useSlots } from 'vue';

import { VxeButton } from 'vxe-pc-ui';

import { getComponent } from '../utils';

interface Props {
  enable: boolean;
  t: (code: string, ...args: any[]) => string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  enable: true,
});
const attrs = useAttrs();
const slots = useSlots();

const getPopconfirmComponent = () => getComponent('Popconfirm');

const getBindValues = computed(() => {
  return {
    cancelText: props.t('common.cancelText'),
    okText: props.t('common.okText'),
    ...unref(props),
    ...unref(attrs),
  };
});

const RenderButton = () => {
  const bindValue = unref(getBindValues) as Record<string, any>;
  if (bindValue.disabled) {
    bindValue.color = '';
  }
  return h(VxeButton, bindValue, slots);
};

const RenderFunction = () => {
  if (!props.enable) {
    return RenderButton();
  }
  const component = getPopconfirmComponent();
  if (!component) {
    throw new Error('未设置Popconfirm组件');
  }
  return h(component, unref(getBindValues), {
    default: () => RenderButton(),
  });
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped></style>
