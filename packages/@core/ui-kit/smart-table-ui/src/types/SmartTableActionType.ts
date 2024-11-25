import type { ExtendedFormApi } from '@vben-core/form-ui';
import type { VxeGridInstance, VxeGridPropTypes } from 'vxe-table';

import type { SmartTableRenderProps } from './index';
import type { SmartSearchFormParameter } from './SmartSearchFormType';
import type { SmartTableFetchParams } from './SmartTableAjaxType';

/**
 * 表格内部函数
 */
interface SmartTableInnerActionType {
  getSearchFormParameter: () => Promise<SmartSearchFormParameter | undefined>;
  hasPermission: (code: string | string[]) => boolean;
  setColumnSortConfig: () => void;
  setSmartTableProps: (props: Partial<SmartTableRenderProps>) => void;
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
  getAddEditForm: () => ExtendedFormApi | null;
  getGrid: () => VxeGridInstance;
  getSearchForm: () => ExtendedFormApi;
  query: (params?: SmartTableFetchParams) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setPagerConfig: (pagerConfig: Partial<VxeGridPropTypes.PagerConfig>) => void;
  setUseYnByCheckbox: (
    useYn: boolean,
    params?: Record<string, any>,
  ) => Promise<boolean>;
  setUseYnByRow: (
    row: any | any[],
    useYn: boolean,
    params?: Record<string, any>,
  ) => Promise<boolean>;
  // 打开添加modal
  showAddModal: (
    selectData?: Record<string, any>,
    formData?: Record<string, any>,
  ) => void;
}

export type { SmartTableAction, SmartTableInnerActionType };
