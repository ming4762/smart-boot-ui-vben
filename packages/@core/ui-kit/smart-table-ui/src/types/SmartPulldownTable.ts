import type { VxePulldownProps } from 'vxe-pc-ui';

import type {
  AnyNormalFunction,
  AnyPromiseFunction,
  Recordable,
} from '@vben-core/typings';

import type { SmartTableProps } from './index';

/**
 * 下拉表格Props
 */
interface SmartPulldownTableProps {
  allowClear?: boolean;
  alwaysLoad?: boolean;
  api?: AnyPromiseFunction<any, any>;
  dropdownHeight?: number;
  dropdownWidth?: number;
  filterOption?: (searchValue: string, row: Recordable<any>) => boolean;
  immediate?: boolean;
  pulldownProps?: Partial<VxePulldownProps>;
  searchIgnoreCase?: boolean;
  showField?: string;
  showFunction?: AnyNormalFunction<any, string>;
  showSearch?: boolean;
  tableProps?: SmartTableProps;
  value?: number | string;
  valueField: string;
}

interface SmartPulldownTableEvent {
  change: [any];
  select: [any];
  'update:value': [null | number | string | undefined];
  visibleChange: [boolean];
}

export type { SmartPulldownTableEvent, SmartPulldownTableProps };
