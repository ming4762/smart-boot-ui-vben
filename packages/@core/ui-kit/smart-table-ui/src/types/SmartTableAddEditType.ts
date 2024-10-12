import type { VbenFormProps } from '@vben-core/form-ui';
import type { ModalProps } from '@vben-core/popup-ui';

import type { VNode } from 'vue';

interface SmartTableModalSlotProps {
  isAdd: boolean;
}

/**
 * 添加修改弹窗
 */
interface SmartTableModalSlots {
  appendFooter?: ((data: SmartTableModalSlotProps) => VNode | VNode[]) | string;
  centerFooter?: ((data: SmartTableModalSlotProps) => VNode | VNode[]) | string;
  footer?: ((data: SmartTableModalSlotProps) => VNode | VNode[]) | string;
  insertFooter?: ((data: SmartTableModalSlotProps) => VNode | VNode[]) | string;
}

/**
 * 添加修改弹窗modal配置
 */
interface SmartTableAddEditModalConfig extends ModalProps {
  slots?: SmartTableModalSlots;
}

/**
 * 添加编辑表单配置
 */
interface SmartTableAddEditConfig<T = any> {
  // 编辑加载完数据执行，返回false或Promise<false>停止后续执行
  afterLoadData?: (
    data: T,
  ) => boolean | Promise<boolean | undefined> | undefined;
  // 保存之后操作，默认reload
  afterSave?: (saveResult?: Record<string, any>) => boolean | Promise<boolean>;
  // 保存之前对数据进行处理
  beforeSave?: (data: T) => Promise<T> | T;
  /**
   * 表单配置项
   */
  formConfig?: Partial<VbenFormProps>;
  /**
   * modal配置
   */
  modalConfig?: Partial<SmartTableAddEditModalConfig>;
  // 自定义弹窗事件
  openModalHandler?: (row: any, formData?: Record<string, any>) => void;
  // 添加修改前的校验
  saveUpdateValidate?: (
    isAdd: boolean,
    selectData?: Record<string, any>,
    formData?: Record<string, any>,
  ) => boolean | Promise<boolean>;
}

interface SmartAddEditModalCallbackData<T = any> {
  afterSave?: () => void;
  formData?: Record<string, any>;
  getFunction?: (data: T) => Promise<T>;
  isAdd: boolean;
  selectData?: Record<string, T>;
  validateFunction?:
    | ((
        data: T,
        customData: any,
      ) => boolean | Promise<boolean | undefined> | undefined)
    | undefined;
}

export type { SmartAddEditModalCallbackData, SmartTableAddEditConfig };
