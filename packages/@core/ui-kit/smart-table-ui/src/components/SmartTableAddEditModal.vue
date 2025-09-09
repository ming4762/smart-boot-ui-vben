<script setup lang="ts">
import type { ExtendedFormApi } from '@vben-core/form-ui';
import type { ExtendedModalApi } from '@vben-core/popup-ui';

import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditModalProps,
} from '../types/SmartTableAddEditType';

import { computed, nextTick, ref, unref, useAttrs, useSlots } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';
import { useVbenModal } from '@vben-core/popup-ui';
import {
  isBoolean,
  isFunction,
  isPromise,
  pick,
} from '@vben-core/shared/utils';

import { successMessage } from '../utils';

interface Props extends SmartTableAddEditModalProps {}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
  afterSaveUpdate: [boolean];
  register: [{ formApi: ExtendedFormApi }];
}>();
const slots = useSlots();

const attrs = useAttrs();

const isAddRef = ref(true);

const computedTitle = computed(() => {
  return unref(isAddRef)
    ? props.t('smartTable.title.add')
    : props.t('smartTable.title.edit');
});

const [From, formApi] = useVbenForm({});

/**
 * 获取所有on开头的函数
 */
const computedOnFunction = computed(() => {
  return pick(attrs, (key) => key.startsWith('on'));
});

/**
 * 加载编辑数据
 * @param data
 * @param modalApi
 */
const loadEditData = async (
  data: SmartAddEditModalCallbackData,
  modalApi: ExtendedModalApi,
) => {
  const { formData, getFunction, isAdd, selectData, validateFunction } = data;
  try {
    if (!isFunction(getFunction)) {
      throw new Error('proxyConfig.ajax.getById未定义');
    }
    modalApi.setState({ loading: true });

    const editData = await getFunction(selectData);
    if (isFunction(validateFunction)) {
      const result = validateFunction(data, selectData);
      if (isBoolean(result) && !result) {
        return false;
      }
      if (isPromise(result)) {
        const promiseResult = await result;
        if (isBoolean(promiseResult) && !promiseResult) {
          return false;
        }
      }
    }
    formApi.setValues({
      ...editData,
      formData,
      isAdd,
    });
  } finally {
    modalApi.setState({ loading: false });
  }
};

// console.log(unref(computedOnFunction))
const [Modal, modalApi] = useVbenModal({
  ...unref(computedOnFunction),
  onConfirm: async () => {
    try {
      const { valid } = await formApi.validate();
      if (!valid) {
        throw new Error('validate error');
      }
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
      const requestData = {
        body: {
          insertRecords: unref(isAddRef) ? [data] : [],
          updateRecords: unref(isAddRef) ? [] : [data],
        },
      };
      const saveResult = await saveFunction(requestData);
      if (props.afterSave) {
        let afterSaveResult = props.afterSave({
          isAdd: unref(isAddRef),
          saveResult,
          ...requestData.body,
        });
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
    if (attrs.onOpened) {
      attrs.onOpened();
    }
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      if (attrs.onOpenChange) {
        attrs.onOpenChange(isOpen);
      }
      return false;
    }
    await nextTick(() => {
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
        loadEditData(data, modalApi);
      }
    });
    if (attrs.onOpenChange) {
      attrs.onOpenChange(isOpen);
    }
  },
});

const formSlots: string[] = [];
const modalSlots: Record<string, string> = {};
Object.keys(slots).forEach((key) => {
  const value = slots[key];
  if (value) {
    if (key.startsWith('modelSlot_')) {
      modalSlots[key.replace('modelSlot_', '')] = key;
    } else {
      formSlots.push(key);
    }
  }
});

emit('register', {
  formApi,
});
</script>

<template>
  <Modal :title="computedTitle" v-bind="attrs">
    <From v-bind="props.formConfig">
      <template
        v-for="formSlotName in formSlots"
        :key="formSlotName"
        #[formSlotName]="formSlotProps"
      >
        <slot :name="formSlotName" v-bind="formSlotProps"></slot>
      </template>
    </From>
    <template
      v-for="(value, key) in modalSlots"
      :key="key"
      #[key]="modalSlotProps"
    >
      <slot :name="value" v-bind="modalSlotProps" :is-add="isAddRef"></slot>
    </template>
  </Modal>
</template>

<style scoped></style>
