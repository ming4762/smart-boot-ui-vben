import type { VbenButtonProps } from '@vben-core/shadcn-ui';
import type { AnyNormalFunction, SmartAuthType } from '@vben-core/typings';

interface PopConfirm {
  cancel?: AnyNormalFunction;
  cancelText?: string;
  confirm: AnyNormalFunction;
  icon?: string;
  okText?: string;
  placement?: string;
  title: string;
}

/**
 * 行按钮编码
 */
type SmartTableRowButtonCode = 'delete' | 'edit';

interface SmartTableActionItem extends VbenButtonProps {
  // 权限编码控制是否显示
  auth?: SmartAuthType;
  // 自定义类名
  class?: any[] | Record<string, boolean> | string;
  code?: SmartTableRowButtonCode;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
  // color?: 'success' | 'error' | 'warning';
  icon?: string;
  // 业务控制是否显示
  ifShow?: ((action: SmartTableActionItem) => boolean) | boolean;
  label?: string;
  onClick?: AnyNormalFunction;
  popConfirm?: PopConfirm;
  // TODO: tooltip props类型未定义
  tooltip?: Record<string, any> | string;
}

interface SmartTableRowActionProps {
  actions?: SmartTableActionItem[];
  divider?: boolean;
  dropDownActions?: SmartTableActionItem[];
  outside?: boolean;
  stopButtonPropagation?: boolean;
}

export type { PopConfirm, SmartTableActionItem, SmartTableRowActionProps };
