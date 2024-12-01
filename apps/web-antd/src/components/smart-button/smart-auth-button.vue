<script setup lang="tsx">
import type { SmartAuthType } from '@vben/types';
import type { ButtonProps, TooltipProps } from 'ant-design-vue';

import { computed, unref, useAttrs, useSlots } from 'vue';

import { useAccess } from '@vben/access';
import { $t } from '@vben/locales';

import { Button, Tooltip } from 'ant-design-vue';

interface Props extends ButtonProps {
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
  const { hasAccessByAuth } = useAccess();
  return hasAccessByAuth(props.auth);
});

const RenderButton = () => {
  return <Button {...{ ...attrs, ...props }}>{slots}</Button>;
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
