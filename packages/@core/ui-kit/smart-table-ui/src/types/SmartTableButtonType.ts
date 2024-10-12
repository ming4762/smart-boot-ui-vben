import type { VbenButtonProps } from '@vben-core/shadcn-ui';
import type { VxeToolbarPropTypes } from 'vxe-table';

import type { SmartAuthType } from './SmartTableAuthType';

import type { Component, ComputedRef, Ref, VNode } from 'vue';

type SmartTableButtonType = 'button' | 'reset' | 'submit' | 'text';
type SmartTableButtonStatus =
  | 'danger'
  | 'info'
  | 'primary'
  | 'success'
  | 'warning';
type SmartTableButtonCode =
  | 'delete'
  | 'export'
  | 'import'
  | 'insert'
  | 'insert_actived'
  | 'mark_cancel'
  | 'ModalAdd'
  | 'ModalEdit'
  | 'open_export'
  | 'open_import'
  | 'query'
  | 'reload'
  | 'remove'
  | 'reset_custom'
  | 'save'
  | 'useYnFalse'
  | 'useYnTrue';

type SmartTableButtonCustomRender = 'ant' | 'element';
type SmartTableToolCode = 'show_search';

/**
 * 下拉按钮配置
 */
interface SmartTableBasicButtonDropdowns {
  auth?: SmartAuthType | string;
  circle?: boolean;
  code?: SmartTableButtonCode;
  disabled?: boolean | ComputedRef<boolean>;
  icon?: string;
  name?: 'smart-auto' | string;
  round?: boolean;
  // 按钮状态
  status?: SmartTableButtonStatus;
  // 按钮类型
  type?: SmartTableButtonType;
  visible?: boolean;
}

/**
 * 按钮渲染配置
 */
interface SmartTableButtonRender {
  events?: any;
  name?: string;
  props?: any;
}

interface SmartTableButton extends SmartTableBasicButtonDropdowns {
  buttonRender?: SmartTableButtonRender;
  // 点击事件是否触发加载状态
  clickLoading?: boolean;
  // 是否是ant-design按钮，false：使用vxe-table原有的按钮，true使用VxeTableToolButtonRenderer进行渲染
  customRender?: SmartTableButtonCustomRender;
  'destroy-on-close'?: boolean;
  dropdowns?: SmartTableBasicButtonDropdowns[];
  placement?: string;
  props?: ComputedRef<VbenButtonProps> | Ref<VbenButtonProps> | VbenButtonProps;
  // 是否使用插槽
  slot?: (button: SmartTableButton & VbenButtonProps) => string | VNode;
  transfer?: boolean;
}

interface SmartTableToolbarTool extends VxeToolbarPropTypes.ToolConfig {
  code?: SmartTableToolCode | string;

  component?: Component;

  props?: Record<string, any>;
}

export type { SmartTableButton, SmartTableToolbarTool };
