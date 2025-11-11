<script setup lang="tsx">
import type { TooltipProps } from 'ant-design-vue';

import type { SmartAuthType } from '@vben/types';

import type { SmartIconButtonProps } from '../type';

import { computed, unref, useAttrs, useSlots } from 'vue';

import { useAccess } from '@vben/access';
import { $t } from '@vben/locales';
import { isFunction } from '@vben/utils';

import { Tooltip } from 'ant-design-vue';

import SmartIconButton from './smart-icon-button.vue';

interface Props extends SmartIconButtonProps {
  auth?: SmartAuthType;
  tooltipProps?: TooltipProps;
}

const props = withDefaults(defineProps<Props>(), {
  auth: undefined,
  tooltipProps: () => {
    return {
      color: 'red',
      title: $t('common.message.noPermission'),
    };
  },
});
const attrs = useAttrs();
const slots = useSlots();

const computedHasAuth = computed(() => {
  if (!props.auth) {
    return true;
  }
  if (isFunction(props.auth)) {
    return props.auth();
  }
  const { hasAccessByAuth } = useAccess();
  return hasAccessByAuth(props.auth);
});

const RenderButton = () => {
  return <SmartIconButton {...{ ...attrs, ...props }}>{slots}</SmartIconButton>;
};

const RenderFunction = () => {
  if (unref(computedHasAuth)) {
    return RenderButton();
  }
  return <Tooltip {...props.tooltipProps}>{RenderButton()}</Tooltip>;
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped></style>
