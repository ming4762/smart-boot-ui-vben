import type { ButtonProps } from 'ant-design-vue';

import type { SmartTableProps } from '@vben/common-ui';

interface SmartTableSelectCommonProps {
  // label字段
  labelField: string;
  // 是否多选
  multiple?: boolean;
  tableProps: SmartTableProps;
  // value字段
  valueField: string;
}

/**
 * 弹窗modal
 */
interface SmartTableSelectModalProps extends SmartTableSelectCommonProps {
  // 是否每次弹窗都加载数据
  alwaysLoad?: boolean;
  listApi: (data: any) => Promise<any>;
  selectTableProps?: Partial<SmartTableProps>;
  selectValues?: any[];
  // 是否显示选中
  showSelect?: boolean;
}

interface SmartTableSelectProps extends SmartTableSelectCommonProps {
  disabled?: boolean;
  size?: string;
  value?: Array<number> | Array<string> | number | string;
}

interface SmartIconButtonProps extends ButtonProps {
  postIcon?: string;
  preIcon?: string;
}

export type {
  SmartIconButtonProps,
  SmartTableSelectModalProps,
  SmartTableSelectProps,
};
