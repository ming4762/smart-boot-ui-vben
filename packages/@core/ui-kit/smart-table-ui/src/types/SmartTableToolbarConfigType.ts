import type { VxeButtonProps } from 'vxe-table';

/**
 * toolbar column config
 */
interface SmartTableToolbarColumnConfig {
  buttonProps?: VxeButtonProps;
  trigger?: 'click' | 'hover' | 'manual';
}

interface SmartTableToolbarSizeSetting {
  // nothing
  buttonProps?: VxeButtonProps;
}

export type { SmartTableToolbarColumnConfig, SmartTableToolbarSizeSetting };
