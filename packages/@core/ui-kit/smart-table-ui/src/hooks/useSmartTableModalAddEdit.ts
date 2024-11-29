import type { ExtendedFormApi, VbenFormProps } from '@vben-core/form-ui';

import type { SmartTableRenderProps } from '../types';
import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditModalProps,
} from '../types/SmartTableAddEditType';
import type { SmartTableContextHandler } from '../types/SmartTableInnerType';

import {
  computed,
  type ComputedRef,
  h,
  nextTick,
  type Slot,
  type Slots,
  unref,
} from 'vue';

import { useVbenModal } from '@vben-core/popup-ui';
import { isPromise, isString } from '@vben-core/shared/utils';

import SmartTableAddEditModal from '../components/SmartTableAddEditModal.vue';
import { warningMessage } from '../utils';

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
  tableProps: ComputedRef<SmartTableRenderProps>,
  getSmartTableContext: SmartTableContextHandler,
  emit: (name: string, ...args: any[]) => void,
  t: (code: string, ...args: string[]) => string,
  slots: Slots,
) => {
  let formApi: ExtendedFormApi | null = null;

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

  const computeAddEditModalProps = computed<
    SmartTableAddEditModalProps | undefined
  >(() => {
    const { addEditConfig, proxyConfig } = unref(tableProps);
    if (!addEditConfig) {
      return undefined;
    }
    const { afterSave, beforeSave, modalConfig } = addEditConfig;
    const saveFunction = proxyConfig?.ajax?.save;
    return {
      ...modalConfig,
      afterSave:
        afterSave ||
        (() => {
          const { query } = getSmartTableContext();
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
   * 添加修改插槽
   */
  const computedAddEditModalFormSlots = computed(() => {
    const { formConfig, modalConfig } = unref(tableProps)?.addEditConfig || {};
    // 处理form slots
    const configFormSlots = formConfig?.slots;
    const formSlots: Record<string, Slot | undefined> = {};
    if (configFormSlots) {
      if (Array.isArray(configFormSlots)) {
        configFormSlots.forEach((item) => {
          formSlots[item] = slots[item];
        });
      } else {
        for (const key of Object.keys(configFormSlots)) {
          const value = configFormSlots[key];
          if (!value) {
            continue;
          }
          formSlots[key] = isString(value) ? slots[key] : (value as never);
        }
      }
    }
    // 处理 column slots
    const columnSlots: Record<string, Slot | undefined> = {};
    const schemaList = formConfig?.schema || [];
    schemaList
      .map((item) => item.slot)
      .filter((item) => item !== undefined)
      .forEach((item) => {
        columnSlots[item] = slots[item];
      });
    const result = {
      ...formSlots,
      ...columnSlots,
    };
    if (
      Object.keys(formSlots).length + Object.keys(columnSlots).length >
      Object.keys(result).length
    ) {
      throw new Error('添加修改表单插槽命名重复');
    }
    // 处理modal slots
    const modalSlots: Record<string, Slot | undefined> = {};
    const configModalSlots = modalConfig?.slots;
    if (configModalSlots) {
      for (const key of Object.keys(configModalSlots)) {
        const value = configModalSlots[key as never];
        modalSlots[`modelSlot_${key}`] = isString(value) ? slots[key] : value;
      }
    }
    return {
      ...result,
      ...modalSlots,
    };
  });

  /**
   * 创建modal
   */
  const [Modal, modalApi] = useVbenModal({
    connectedComponent: SmartTableAddEditModal,
    draggable: true,
  });

  const AddEditModal = () =>
    h(
      Modal,
      {
        ...unref(computeAddEditModalProps),
        onAfterSaveUpdate: (isAdd: boolean) => {
          emit('afterSaveUpdate', isAdd);
        },
        onRegister: ({ formApi: modalFormApi }: any) => {
          formApi = modalFormApi;
        },
      },
      unref(computedAddEditModalFormSlots),
    );

  const doOpenModal = async (
    isAdd: boolean,
    selectData?: Record<string, any>,
    formData?: Record<string, any>,
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

  /**
   * 显示修改弹窗
   * @param selectData
   * @param formData
   */
  const showAddModal = (
    selectData?: Record<string, any>,
    formData?: Record<string, any>,
  ) => {
    if (!unref(computedHasAddEdit)) {
      throw new Error('addEditConfig未定义');
    }
    return doOpenModal(true, selectData, formData);
  };

  const doEdit = async (row: any, formData?: Record<string, any>) => {
    if (!unref(computedHasAddEdit)) {
      throw new Error('addEditConfig未定义');
    }
    if (unref(tableProps).addEditConfig?.openModalHandler) {
      unref(tableProps).addEditConfig?.openModalHandler?.(row, formData);
    } else {
      doOpenModal(false, row, formData);
    }
    return true;
  };

  /**
   * checkbox选中更新
   */
  const editByCheckbox = () => {
    const { getGrid } = getSmartTableContext();
    const selectRows = getGrid().getCheckboxRecords(false);
    if (selectRows.length !== 1) {
      warningMessage(t('smartTable.message.choseOne'));
      return false;
    }
    const editRow = selectRows[0];
    return doEdit(editRow);
  };

  /**
   * 根据填入的数据更新
   * @param row
   * @param formData
   */
  const editByRowModal = (row: any, formData?: Record<string, any>) => {
    return doEdit(row, formData);
  };

  const getAddEditForm = () => formApi;

  return {
    AddEditModal,
    computeAddEditModalProps,
    computedAddEditFormProps,
    computedHasAddEdit,
    editByCheckbox,
    editByRowModal,
    getAddEditForm,
    showAddModal,
  };
};
