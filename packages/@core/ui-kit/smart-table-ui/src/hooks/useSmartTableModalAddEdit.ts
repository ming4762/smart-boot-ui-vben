import type { VbenFormProps } from '@vben-core/form-ui';

import type { SmartTableRenderProps } from '../types';
import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditModalProps,
} from '../types/SmartTableAddEditType';

import { computed, h, nextTick, unref } from 'vue';

import { useVbenModal } from '@vben-core/popup-ui';
import { isPromise } from '@vben-core/shared/utils';

import SmartTableAddEditModal from '../components/SmartTableAddEditModal.vue';

interface Action {
  query: () => Promise<void>;
}

const SizeMap: { [index: string]: 'default' | 'large' | 'small' } = {
  midum: 'default',
  mini: 'small',
  small: 'small',
  tiny: 'small',
};

const getDefaultFormConfig = (): Partial<VbenFormProps> => {
  return {
    showDefaultActions: false,
  };
};

export const useSmartTableModalAddEditEdit = (
  tableProps: SmartTableRenderProps,
  emit: (name: string, ...args: any[]) => void,
  t: (code: string, ...args: string[]) => string,
  { query }: Action,
) => {
  /**
   * 是否有添加修改弹窗
   */
  const computedHasAddEdit = computed(() => {
    return unref(tableProps).addEditConfig !== undefined;
  });

  /**
   * 添加修改弹窗表单计算属性
   */
  const computedAddEditFormProps = computed(() => {
    const { addEditConfig, size: tableSize } = unref(tableProps);
    const formConfig = addEditConfig?.formConfig;
    if (!formConfig) {
      return {};
    }
    const { size } = formConfig;
    const formSize = size || SizeMap[tableSize || ''];
    const props: VbenFormProps = {
      ...getDefaultFormConfig(),
      ...formConfig,
      commonConfig: {
        ...formConfig.commonConfig,
        componentProps: {
          size: formSize,
          ...formConfig.commonConfig?.componentProps,
        },
      },
    };
    return props;
  });

  const computeAddEditModalProps = computed<SmartTableAddEditModalProps>(() => {
    const { addEditConfig, proxyConfig } = unref(tableProps);
    if (!addEditConfig) {
      return {};
    }
    const { afterSave, beforeSave, modalConfig } = addEditConfig;
    const saveFunction = proxyConfig?.ajax?.save;
    return {
      ...modalConfig,
      afterSave:
        afterSave ||
        (() => {
          query();
          return true;
        }),
      beforeSave,
      formConfig: unref(computedAddEditFormProps),
      saveFunction,
      t,
    };
  });

  const getCallbackData = (
    isAdd: boolean,
    selectData?: Record<string, any>,
    formData?: Record<string, any>,
  ): SmartAddEditModalCallbackData => {
    const getByIdFunction = unref(tableProps)?.proxyConfig?.ajax?.getById;
    if (!getByIdFunction) {
      throw new Error('proxyConfig.ajax.getById未设置');
    }
    return {
      formData,
      getFunction: getByIdFunction,
      isAdd,
      selectData,
      validateFunction: unref(tableProps)?.addEditConfig?.afterLoadData,
    };
  };

  /**
   * 创建modal
   */
  const [Modal, modalApi] = useVbenModal({
    connectedComponent: SmartTableAddEditModal,
    draggable: true,
  });

  const AddEditModal = () =>
    h(Modal, {
      ...unref(computeAddEditModalProps),
      onAfterSaveUpdate: (isAdd: boolean) => {
        emit('afterSaveUpdate', isAdd);
      },
    });

  const doOpenModal = async (
    isAdd: boolean,
    formData?: Record<string, any>,
    selectData?: Record<string, any>,
  ) => {
    // 校验参数
    const saveUpdateValidate =
      unref(tableProps).addEditConfig?.saveUpdateValidate;
    if (saveUpdateValidate) {
      const validateResult = saveUpdateValidate(isAdd, selectData, formData);
      const realValidateResult = isPromise(validateResult)
        ? await validateResult
        : validateResult;
      if (!realValidateResult) {
        return false;
      }
    }
    nextTick(() => {
      emit('addEditModalShow', { formData, isAdd, selectData });
    });
    modalApi.setData(getCallbackData(isAdd, selectData, formData));
    modalApi.open();
  };

  const showAddModal = (
    formData?: Record<string, any>,
    selectData?: Record<string, any>,
  ) => {
    if (!unref(computedHasAddEdit)) {
      throw new Error('addEditConfig未定义');
    }
    doOpenModal(true, formData, selectData);
  };

  return {
    AddEditModal,
    computeAddEditModalProps,
    computedAddEditFormProps,
    computedHasAddEdit,
    showAddModal,
  };
};
