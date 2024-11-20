import type { ComputedRef } from 'vue';

interface SmartTableInnerContext {
  /**
   * 搜索表单显示状态
   */
  computedSearchFormVisible: ComputedRef<boolean>;
}

export type { SmartTableInnerContext };
