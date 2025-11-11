<script setup lang="ts">
import { ref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';

import DataDictGroup from './components/DataDictGroup.vue';
import DataDictItem from './components/DataDictItem.vue';

const dictId = ref<number | undefined>();

const handleCodeChange = (id: number) => {
  dictId.value = id;
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate class="h-full" first-size="60%">
      <template #first>
        <DataDictGroup @code-change="handleCodeChange" />
      </template>
      <template #second>
        <DataDictItem :dict-id="dictId" />
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped></style>
