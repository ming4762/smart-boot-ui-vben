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
  const classList = ['smart-search-container', 'bg-background'];
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
    <div class="smart-table-container bg-background h-full">
      <slot name="table"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.smart-table-search-layout {
  height: 100%;
  display: flex;
  flex-flow: column;
}

.smart-search-container {
  width: 100%;
  margin-bottom: 5px;
  padding: 12px 10px 0;
}

.smart-table-container {
  flex: 1;
  min-height: 1px;
  padding: 0 5px 0;
}

.smart-table-search-hidden {
  display: none;
}
</style>
