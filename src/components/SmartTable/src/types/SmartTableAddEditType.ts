import type { ModalProps } from '@/components/Modal';
import type { FormProps } from '@/components/Form';
import { VNode } from 'vue';

interface SmartTableModalSlotProps {
  isAdd: boolean;
}

/**
 * 添加修改弹窗
 */
export interface SmartTableModalSlots {
  footer?: string | ((data: SmartTableModalSlotProps) => VNode[] | VNode);
  insertFooter?: string | ((data: SmartTableModalSlotProps) => VNode[] | VNode);
  centerFooter?: string | ((data: SmartTableModalSlotProps) => VNode[] | VNode);
  appendFooter?: string | ((data: SmartTableModalSlotProps) => VNode[] | VNode);
}

/**
 * 添加修改弹窗modal配置
 */
export interface SmartTableAddEditModalConfig extends ModalProps {
  slots?: SmartTableModalSlots;
}

/**
 * 添加编辑表单配置
 */
export interface SmartTableAddEditConfig<T = any> {
  /**
   * modal配置
   */
  modalConfig?: Partial<SmartTableAddEditModalConfig>;
  /**
   * 表单配置项
   */
  formConfig?: Partial<FormProps>;
  // 编辑加载完数据执行，返回false或Promise<false>停止后续执行
  afterLoadData?: (data: T) => Promise<boolean | undefined> | boolean | undefined;
  // 保存之前对数据进行处理
  beforeSave?: (data: T) => T | Promise<T>;
  // 保存之后操作，默认reload
  afterSave?: (saveResult?: Recordable) => boolean | Promise<boolean> | void;
  // 自定义弹窗事件
  openModalHandler?: (row: any, formData?: Recordable) => void;
  // 添加修改前的校验
  saveUpdateValidate?: (
    isAdd: boolean,
    selectData?: Recordable,
    formData?: Recordable,
  ) => boolean | Promise<boolean>;
}

export interface SmartAddEditModalCallbackData<T = any> {
  getFunction?: (data: T) => Promise<T>;
  validateFunction?:
    | ((data: T, customData: any) => Promise<boolean | undefined> | boolean | undefined)
    | undefined;
  isAdd: boolean;
  selectData?: Recordable<T>;
  formData?: Recordable;
  afterSave?: () => void;
}
