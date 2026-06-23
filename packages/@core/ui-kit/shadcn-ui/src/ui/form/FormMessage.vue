<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { toValue } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ErrorMessage } from 'vee-validate';

import { useFormField } from './useFormField';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { name, formMessageId } = useFormField();
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    data-slot="form-message"
    as="p"
    :name="toValue(name)"
    :class="cn('text-destructive text-sm', props.class)"
  />
</template>

<style>
.vben-form-message-compact {
  position: absolute;
  top: 100%;
  left: 1rem;
  z-index: 1;
  width: calc(100% - 1rem);
  height: auto;
  min-height: 1.5rem;
  padding: 2px 8px;
  color: hsl(var(--destructive-foreground));
  pointer-events: none;
  background: hsl(var(--destructive));
  border-radius: var(--radius);
  opacity: 1;
}
</style>
