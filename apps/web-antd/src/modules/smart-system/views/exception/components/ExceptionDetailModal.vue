<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getById } from '../SysExceptionListView.api';

const exceptionData = ref<Recordable<any>>({});

const [Modal, modelApi] = useVbenModal({
  title: $t('system.views.exception.title.stackTrace'),
  fullscreen: true,
  onOpened: async () => {
    const id = modelApi.getData();
    try {
      modelApi.setState({ loading: true });
      exceptionData.value = await getById(id);
    } finally {
      modelApi.setState({ loading: false });
    }
  },
  onClosed: () => {
    exceptionData.value = {};
  },
});
</script>

<template>
  <Modal>
    <div style="height: 100%; overflow: auto">
      <div style="font-size: 14px; white-space: pre">
        {{ exceptionData.stackTrace }}
      </div>
    </div>
  </Modal>
</template>

<style scoped></style>
