<script setup lang="ts">
import { ref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';

import I18nGroupList from './components/I18nGroupList.vue';
import I18nItemList from './components/I18nItemList.vue';
import I18nList from './components/I18nList.vue';

const groupId = ref<null | number>();
const i18nId = ref<number>();
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate class="h-full" first-size="300px" layout="leftRight">
      <template #first>
        <!--    国际化分组    -->
        <I18nGroupList @change="(id) => (groupId = id)" />
      </template>
      <template #second>
        <SmartLayoutSeparate class="h-full" first-size="60%" layout="topBottom">
          <template #first>
            <I18nList :group-id="groupId" @change="(id) => (i18nId = id)" />
          </template>
          <template #second>
            <I18nItemList :i18n-id="i18nId" />
          </template>
        </SmartLayoutSeparate>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped></style>
