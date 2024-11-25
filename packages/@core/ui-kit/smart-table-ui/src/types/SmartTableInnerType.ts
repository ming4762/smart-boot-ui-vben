import type { Nullable } from '@vben-core/typings';

import type { SmartTableAction, SmartTableRenderProps } from './index';
import type { SmartTableInnerActionType } from './SmartTableActionType';

import type { ComputedRef, Ref } from 'vue';

interface SmartTableInnerContext {
  /**
   * 搜索表单显示状态
   */
  computedSearchFormVisible: ComputedRef<boolean>;
}

type SmartTableContext = {
  getBindValues: ComputedRef<SmartTableRenderProps>;
  id: string;
  t: (key: string, args?: any) => string;
  tableInnerAction: SmartTableInnerActionType;
  tableInnerContext: SmartTableInnerContext;
  wrapRef: Ref<Nullable<HTMLElement>>;
} & SmartTableAction;

type SmartTableContextHandler = () => SmartTableContext;

export type {
  SmartTableContext,
  SmartTableContextHandler,
  SmartTableInnerContext,
};
