import type { SmartTableProps } from '@vben/common-ui';

interface SmartTableSelectCommonProps {
  tableProps: SmartTableProps;
  // 是否多选
  multiple?: boolean;
  // label字段
  labelField: string;
  // value字段
  valueField: string;
}

/**
 * 弹窗modal
 */
interface SmartTableSelectModalProps extends SmartTableSelectCommonProps {
  selectTableProps: Partial<SmartTableProps>;
  // 是否显示选中
  showSelect?: boolean;
  selectValues?: any[];
  listApi: (data: any) => Promise<any>;
  // 是否每次弹窗都加载数据
  alwaysLoad?: boolean;
}

interface SmartTableSelectProps extends SmartTableSelectCommonProps {
  value?: Array<number> | Array<string> | number | string;
  disabled?: boolean;
  size?: string;
}

export type { SmartTableSelectModalProps, SmartTableSelectProps };
