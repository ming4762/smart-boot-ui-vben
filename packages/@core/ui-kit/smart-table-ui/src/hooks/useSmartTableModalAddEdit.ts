import type { ComputedRef, Ref, Slot, Slots } from 'vue';

import type { ExtendedFormApi, VbenFormProps } from '@vben-core/form-ui';

import type { SmartTableRenderProps } from '../types';
import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditModalProps,
} from '../types/SmartTableAddEditType';
import type { SmartTableContextHandler } from '../types/SmartTableInnerType';

import { computed, h, nextTick, unref } from 'vue';

import { useVbenModal } from '@vben-core/popup-ui';
import { isPromise, isString } from '@vben-core/shared/utils';

import SmartTableAddEditModal from '../components/SmartTableAddEditModal.vue';
import { warningMessage } from '../utils';
import { getFormSlots } from '../utils/slots';

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
  slotsRef: Ref<Slots>,
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
          allowClear: true,
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
        ((data) => {
          const { query, updateRowByIdProxy } = getSmartTableContext();
          const { isAdd, updateRecords } = data;
          if (isAdd) {
            query();
            return true;
          }
          const keyField = unref(tableProps).rowConfig?.keyField;
          if (!keyField) {
            query();
            return true;
          }
          // const grid = getGrid();
          if (updateRecords.length > 0) {
            // TODO: vxe-table setRow有缺陷，等修复后改为如下方法
            // updateRecords.forEach((item) => {
            //   grid.setRow(item, item);
            // });
            updateRowByIdProxy(updateRecords.map((item) => item[keyField]));
          }
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
    const slots = unref(slotsRef);

    const { formConfig, modalConfig } = unref(tableProps)?.addEditConfig || {};
    const result = getFormSlots(slots, formConfig);

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
    computedHasAddEdit,
    editByCheckbox,
    editByRowModal,
    getAddEditForm,
    showAddModal,
  };
};
