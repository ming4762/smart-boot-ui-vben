<script setup lang="ts">
import { ref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';

import SysI18nJsonItemListView from './components/SysI18nJsonItemListView.vue';
import SysI18nJsonListView from './components/SysI18nJsonListView.vue';

const currentI18nIdRef = ref<number | undefined>();

const handleCurrentChange = ({ row }: any) => {
  currentI18nIdRef.value = row.id;
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate
      class="h-full"
      draggable
      layout="topBottom"
      first-size="60%"
    >
      <template #first>
        <SysI18nJsonListView @current-change="handleCurrentChange" />
      </template>
      <template #second>
        <SysI18nJsonItemListView :i18n-id="currentI18nIdRef" />
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped></style>
