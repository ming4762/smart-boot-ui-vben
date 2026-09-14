<script setup lang="ts">
import type { SlowSqlDetail } from '../SmartMonitorSlowSqlListView.api';

import { nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { getByIdApi } from '../SmartMonitorSlowSqlListView.api';
import SqlDetail from './SqlDetail.vue';

interface ModalData {
  id: number;
}

const sqlDetailRef = ref<SlowSqlDetail>();

const [Modal, modalApi] = useVbenModal<ModalData>({
  title: 'SQL详情',
  class: 'w-[960px]',
  showCancelButton: false,
  onOpenChange: (visible) => {
    if (!visible) {
      return;
    }
    const id = modalApi.getData()?.id;
    if (!id) {
      throw new Error('ID is required');
    }
    sqlDetailRef.value = undefined;
    nextTick(async () => {
      try {
        modalApi.setState({ loading: true });
        sqlDetailRef.value = await getByIdApi(id);
      } finally {
        modalApi.setState({ loading: false });
      }
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
