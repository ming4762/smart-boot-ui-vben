<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { listToTree } from '@vben/utils';

import { listDataPermissionWithFunctionApi } from '../RoleListView.api';

interface Props {
  roleId?: number | string;
  isSuperAdmin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSuperAdmin: false,
  roleId: undefined,
});

const dataLoadingRef = ref(false);
const saveLoadingRef = ref(false);
const dataPermissionListRef = ref<any[]>([]);

const computedDataPermissionTreeData = computed(() => {
  return listToTree(
    dataPermissionListRef.value.map(
      ({ functionId, functionName, parentId }: any) => {
        return {
          key: functionId,
          title: functionName,
          parentId,
        };
      },
    ),
    (item) => item.key,
    (item) => item.parentId,
    0,
  );
});

const loadDataPermission = async () => {
  dataLoadingRef.value = true;
  try {
    dataPermissionListRef.value = await listDataPermissionWithFunctionApi();
  } finally {
    dataLoadingRef.value = false;
  }
};

onMounted(() => {
  loadDataPermission();
});
</script>

<template>
  <div>
    {{ computedDataPermissionTreeData }} {{ props }} {{ saveLoadingRef }}
  </div>
</template>

<style scoped></style>
