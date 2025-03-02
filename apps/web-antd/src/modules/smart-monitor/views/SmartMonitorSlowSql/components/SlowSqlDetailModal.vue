<script setup lang="ts">
import { nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import SqlDetail from '#/modules/smart-monitor/components/SqlDetail.vue';

import { getByIdApi } from '../SmartMonitorSlowSqlListView.api';

const sqlDetailRef = ref<any>({});

const [Modal, modalApi] = useVbenModal({
  title: 'SQL详情',
  showCancelButton: false,
  onOpenChange: (visible) => {
    if (!visible) {
      return;
    }
    const { id } = modalApi.getData();
    nextTick(async () => {
      const detail = await getByIdApi(id);
      sqlDetailRef.value = detail;
    });
  },
  onConfirm: () => {
    modalApi.close();
  },
});
</script>

<template>
  <Modal>
    <SqlDetail :detail="sqlDetailRef" />
  </Modal>
</template>

<style scoped></style>
