<script setup lang="ts">
import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditModalProps,
} from '../types/SmartTableAddEditType';

import { computed, ref, unref } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { useVbenModal } from '@vben-core/popup-ui';
import { isBoolean, isPromise } from '@vben-core/shared/utils';

import { successMessage } from '../utils';

interface Props extends SmartTableAddEditModalProps {}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{ afterSaveUpdate: [boolean] }>();

const isAddRef = ref(true);

const computedTitle = computed(() => {
  return unref(isAddRef)
    ? props.t('smartTable.title.add')
    : props.t('smartTable.title.edit');
});

const [From, formApi] = useVbenForm({});

const loadEditData = () => {};

const [Modal, modalApi] = useVbenModal({
  onConfirm: async () => {
    try {
      await formApi.validate();
      let data = await formApi.getValues();
      modalApi.setState({ confirmLoading: true });
      // 保存前对参数进行处理
      const beforeSave = props.beforeSave;
      if (beforeSave) {
        if (!isFunction(beforeSave)) {
          throw new Error('参数错误，beforeSave必须是Function');
        }
        const result = beforeSave(data);
        data = isPromise(result) ? await result : result;
      }
      const saveFunction = props.saveFunction;
      if (!saveFunction) {
        throw new Error('proxyConfig.ajax.save未定义，无法执行保存操作');
      }
      const saveResult = await saveFunction({
        body: {
          insertRecords: unref(isAddRef) ? [data] : [],
          updateRecords: unref(isAddRef) ? [] : [data],
        },
      });
      if (props.afterSave) {
        let afterSaveResult = props.afterSave(saveResult);
        if (isPromise(afterSaveResult)) {
          afterSaveResult = await afterSaveResult;
        }
        if (isBoolean(afterSaveResult) && !afterSaveResult) {
          // 返回结果验证错误，停止执行
          return false;
        }
      }
      emit('afterSaveUpdate', unref(isAddRef));
      successMessage(
        unref(isAddRef)
          ? props.t('smartTable.message.saveSuccess')
          : props.t('smartTable.message.editSuccess'),
      );
      // 关闭弹窗
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  },
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
    <From v-bind="props.formConfig" />
  </Modal>
</template>

<style scoped></style>
