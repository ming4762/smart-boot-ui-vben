import type { VxeButtonProps } from 'vxe-table';

/**
 * toolbar column config
 */
interface SmartTableToolbarColumnConfig {
  buttonProps?: VxeButtonProps;
  // 是否支持列排序
  columnOrder?: boolean;
  trigger?: 'click' | 'hover' | 'manual';
}

interface SmartTableToolbarSizeSetting {
  // nothing
  buttonProps?: VxeButtonProps;
}

export type { SmartTableToolbarColumnConfig, SmartTableToolbarSizeSetting };
