import type { ExtendedFormApi } from '@vben-core/form-ui';
import type { VxeGridInstance } from 'vxe-table';

import type { SmartTableFetchParams } from './SmartTableAjaxType';

/**
 * 表格内部函数
 */
interface SmartTableInnerActionType {
  hasPermission: (code: string | string[]) => boolean;
}

/**
 * SmartTable 支持的函数
 */
interface SmartTableAction {
  deleteByCheckbox: () => Promise<boolean>;
  deleteByRow: (row: any | any[]) => Promise<boolean>;
  editByCheckbox: () => boolean | Promise<boolean>;
  editByRowModal: (
    row: any,
    formData?: Record<string, any>,
  ) => boolean | Promise<boolean>;
  getAddEditForm: () => ExtendedFormApi;
  getGrid: () => VxeGridInstance;
  getSearchForm: () => ExtendedFormApi;
  query: (params?: SmartTableFetchParams) => Promise<void>;
  setLoading: (loading: boolean) => void;
  // 打开添加modal
  showAddModal: (
    selectData?: Record<string, any>,
    formData?: Record<string, any>,
  ) => void;
}

export type { SmartTableAction, SmartTableInnerActionType };
