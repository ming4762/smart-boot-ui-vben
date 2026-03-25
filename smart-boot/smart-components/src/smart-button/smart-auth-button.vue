<script setup lang="tsx">
import type { TooltipProps } from 'antdv-next';

import type { SmartAuthType } from '@vben/types';

import type { SmartIconButtonProps } from '../type';

import { computed, useAttrs, useSlots } from 'vue';

import { useAccess } from '@vben/access';
import { $t } from '@vben/locales';
import { isFunction } from '@vben/utils';

import { Tooltip } from 'antdv-next';

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

const computedButtonBinds = computed(() => {
  return {
    ...attrs,
    ...props,
  }
})
</script>

<template>
  <SmartIconButton v-if="computedHasAuth" v-bind="computedButtonBinds">{{ slots }}</SmartIconButton>
  <Tooltip v-else v-bind="props.tooltipProps">
    <SmartIconButton v-bind="computedButtonBinds">{{ slots }}</SmartIconButton>
  </Tooltip>
</template>

<style scoped></style>
