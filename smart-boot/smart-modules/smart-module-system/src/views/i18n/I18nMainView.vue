<script setup lang="ts">
import { ref } from 'vue';

import { ResizableLayout } from '@vben/common-ui';

import I18nGroupList from './components/I18nGroupList.vue';
import I18nItemList from './components/I18nItemList.vue';
import I18nList from './components/I18nList.vue';

const groupId = ref<number | undefined>();
const i18nId = ref<number | undefined>();
</script>

<template>
  <div class="page-container h-full">
    <ResizableLayout
      class="h-full"
      :first-size="300"
      :resizable="false"
      :show-handle="false"
      size-unit="px"
    >
      <template #first>
        <!--    国际化分组    -->
        <I18nGroupList @change="(id) => (groupId = id)" />
      </template>
      <template #second>
        <ResizableLayout
          class="h-full"
          direction="vertical"
          :first-size="60"
          :resizable="false"
          :show-handle="false"
        >
          <template #first>
            <I18nList :group-id="groupId" @change="(id) => (i18nId = id)" />
          </template>
          <template #second>
            <I18nItemList :i18n-id="i18nId" />
          </template>
        </ResizableLayout>
      </template>
    </ResizableLayout>
  </div>
</template>

<style scoped></style>
