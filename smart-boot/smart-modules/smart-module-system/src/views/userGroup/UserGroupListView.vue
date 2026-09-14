<script setup lang="ts">
import { ResizableLayout } from '@vben/common-ui';

import UserGroupList from './components/UserGroupList.vue';
import UserGroupUserList from './components/UserGroupUserList.vue';

interface Props {
  groupId?: number | string;
}
const props = defineProps<Props>();
</script>

<template>
  <ResizableLayout
    class="page-container h-full"
    direction="vertical"
    divider-size="5px"
    :first-size="60"
    :resizable="false"
    show-divider
    :show-handle="false"
  >
    <template #first>
      <UserGroupList :group-id="props.groupId" />
    </template>
    <template #second>
      <UserGroupUserList :group-id="props.groupId" />
    </template>
  </ResizableLayout>
</template>

<style scoped></style>
