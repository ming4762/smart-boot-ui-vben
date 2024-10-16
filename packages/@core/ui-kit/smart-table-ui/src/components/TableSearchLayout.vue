<script setup lang="tsx">
import type { SmartTableLayoutProps } from '../types';

import { computed, unref } from 'vue';

interface Props extends SmartTableLayoutProps {}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
});

/**
 * 搜索DIV样式
 */
const computedSearchContainerClass = computed(() => {
  const classList = ['smart-search-container'];
  if (!unref(props.showSearch)) {
    classList.push('smart-table-search-hidden');
  }
  return classList;
});
</script>

<template>
  <div class="smart-table-search-layout">
    <div v-if="showSearch" :class="computedSearchContainerClass">
      <slot name="search"></slot>
    </div>
    <div class="smart-table-container">
      <slot name="table"></slot>
    </div>
  </div>
</template>

<style scoped></style>
