<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { useFormField } from './useFormField';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { error, formMessageId } = useFormField();
</script>

<template>
  <p
    v-if="error"
    :id="formMessageId"
    data-slot="form-message"
    :class="cn('text-destructive text-sm', props.class)"
  >
    {{ error }}
  </p>
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
