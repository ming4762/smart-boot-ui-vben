<script setup lang="ts">
import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditModalProps,
} from '../types/SmartTableAddEditType';

import { computed, ref, unref } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { useVbenModal } from '@vben-core/popup-ui';

interface Props extends SmartTableAddEditModalProps {}

const props = withDefaults(defineProps<Props>(), {});

const isAddRef = ref(true);

const computedTitle = computed(() => {
  return unref(isAddRef)
    ? props.t('smartTable.title.add')
    : props.t('smartTable.title.edit');
});

const [From, formApi] = useVbenForm({});

const loadEditData = () => {};

const [Modal, modalApi] = useVbenModal({
  onOpenChange: (isOpen) => {
    if (!isOpen) {
      return false;
    }
    const data = modalApi.getData<SmartAddEditModalCallbackData>();
    const { formData, isAdd } = data;
    formApi.resetForm();
    isAddRef.value = isAdd;
    if (isAdd) {
      formApi.setValues({
        ...formData,
        isAdd,
      });
    } else {
      loadEditData();
    }
  },
});
</script>

<template>
  <Modal :title="computedTitle">
    <From />
  </Modal>
</template>

<style scoped></style>
