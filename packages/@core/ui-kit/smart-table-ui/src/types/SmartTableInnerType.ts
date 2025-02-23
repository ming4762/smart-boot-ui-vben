import type { ComputedRef, Ref } from 'vue';

import type { Nullable } from '@vben-core/typings';

import type { SmartTableAction, SmartTableRenderProps } from './index';
import type { SmartTableInnerActionType } from './SmartTableActionType';

interface SmartTableInnerContext {
  /**
   * 搜索表单显示状态
   */
  computedSearchFormVisible: ComputedRef<boolean>;
  /**
   * 表格加载状态
   */
  tableLoading: Ref<boolean>;
}

type SmartTableContext = SmartTableAction & {
  getBindValues: ComputedRef<SmartTableRenderProps>;
  id: string;
  t: (key: string, args?: any) => string;
  tableInnerAction: SmartTableInnerActionType;
  tableInnerContext: SmartTableInnerContext;
  wrapRef: Ref<Nullable<HTMLElement>>;
};

type SmartTableContextHandler = () => SmartTableContext;

export type {
  SmartTableContext,
  SmartTableContextHandler,
  SmartTableInnerContext,
};
