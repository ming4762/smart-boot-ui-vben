<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';

import { unref, useTemplateRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t } from '@vben/locales';

import { successMessage } from '#/utils';

import { saveUpdateBatchApi } from '../SysDept.api';
import SysDeptEdit from './SysDeptEdit.vue';

const emit = defineEmits(['afterSave']);

const formRef = useTemplateRef<typeof SysDeptEdit>('formRef');

const { getFormSize } = useSizeSetting();

const handleOk = async (modalApi: ExtendedModalApi) => {
  const model = await unref(formRef)?.validateAndGet();
  try {
    modalApi.setState({
      confirmLoading: true,
    });
    await saveUpdateBatchApi([model]);
    successMessage($t('common.message.saveSuccess'));
    modalApi.close();
    emit('afterSave');
  } finally {
    modalApi.setState({
      confirmLoading: false,
    });
  }
};

const [Modal, modalApi] = useVbenModal({
  title: $t('common.button.add'),
  onOpened: () => {
    const data = modalApi.getData();
    unref(formRef)?.setValues(data);
  },
  onClosed: () => {
    unref(formRef)?.resetForm();
  },
  onConfirm: () => handleOk(modalApi),
});
</script>

<template>
  <Modal>
    <SysDeptEdit ref="formRef" :size="getFormSize" filter-field />
  </Modal>
</template>

<style scoped></style>
