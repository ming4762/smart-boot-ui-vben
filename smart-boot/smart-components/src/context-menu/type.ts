import type { CSSProperties } from 'vue';

import type { AnyFunction } from '@vben/types';

interface Axis {
  x: number;
  y: number;
}

interface ContextMenuItem {
  children?: ContextMenuItem[];
  disabled?: boolean;
  divider?: boolean;
  handler?: AnyFunction<any, any>;
  hidden?: boolean;
  icon?: string;
  label: string;
}

interface ItemContentProps {
  handler: AnyFunction<any, any>;
  item: ContextMenuItem;
  showIcon: boolean | undefined;
}

interface CreateContextOptions {
  event: MouseEvent;
  icon?: string;
  items?: ContextMenuItem[];
  styles?: any;
}

interface ContextMenuProps {
  axis?: Axis;
  customEvent?: Event;
  items?: ContextMenuItem[];
  showIcon?: boolean;
  styles?: CSSProperties;
  width?: number;
}

export type {
  Axis,
  ContextMenuItem,
  ContextMenuProps,
  CreateContextOptions,
  ItemContentProps,
};
