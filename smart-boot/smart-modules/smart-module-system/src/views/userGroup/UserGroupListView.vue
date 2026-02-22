<script setup lang="ts">
import { SmartLayoutSeparate } from '@vben/common-ui';

import UserGroupList from './components/UserGroupList.vue';
import UserGroupUserList from './components/UserGroupUserList.vue';

interface Props {
  groupId?: number | string;
}
const props = defineProps<Props>();
</script>

<template>
  <SmartLayoutSeparate
    class="page-container h-full"
    first-size="60%"
    layout="topBottom"
    show-divider
  >
    <template #first>
      <UserGroupList :group-id="props.groupId" />
    </template>
    <template #second>
      <UserGroupUserList :group-id="props.groupId" />
    </template>
  </SmartLayoutSeparate>
</template>

<style scoped></style>
