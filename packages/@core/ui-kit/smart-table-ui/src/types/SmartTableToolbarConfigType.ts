import type { VxeButtonProps } from 'vxe-pc-ui';

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
