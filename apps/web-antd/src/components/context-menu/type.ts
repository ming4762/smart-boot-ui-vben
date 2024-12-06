import type { AnyFunction } from '@vben/types';

import type { CSSProperties } from 'vue';

interface Axis {
  x: number;
  y: number;
}

interface ContextMenuItem {
  label: string;
  icon?: string;
  hidden?: boolean;
  disabled?: boolean;
  handler?: AnyFunction<any, any>;
  divider?: boolean;
  children?: ContextMenuItem[];
}

interface ItemContentProps {
  showIcon: boolean | undefined;
  item: ContextMenuItem;
  handler: AnyFunction<any, any>;
}

interface CreateContextOptions {
  event: MouseEvent;
  icon?: string;
  styles?: any;
  items?: ContextMenuItem[];
}

interface ContextMenuProps {
  width?: number;
  customEvent?: Event;
  styles?: CSSProperties;
  showIcon?: boolean;
  axis?: Axis;
  items?: ContextMenuItem[];
}

export type {
  Axis,
  ContextMenuItem,
  ContextMenuProps,
  CreateContextOptions,
  ItemContentProps,
};
