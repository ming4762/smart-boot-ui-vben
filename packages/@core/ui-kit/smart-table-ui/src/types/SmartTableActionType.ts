import type { VxeGridInstance, VxeGridPropTypes } from 'vxe-table';

import type { ExtendedFormApi } from '@vben-core/form-ui';
import type { ExtendedModalApi } from '@vben-core/popup-ui';
import type { SmartAuthType } from '@vben-core/typings';

import type { SmartSearchFormParameter } from './SmartSearchFormType';
import type { SmartTableFetchParams } from './SmartTableAjaxType';
import type { SmartTableRenderProps } from './SmartTableCommonType';

/**
 * 表格内部函数
 */
interface SmartTableInnerActionType {
  getSearchFormParameter: () => Promise<SmartSearchFormParameter | undefined>;
  hasPermission: (auth?: SmartAuthType | string) => boolean;
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
  getAddEditModal: () => ExtendedModalApi;
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
  // 切换搜索表单显示隐藏状态，如果visible为null，则取反
  switchSearchFormVisible: (visible?: boolean) => void;
  /**
   * 根据ID更新行数据
   * 调用后台更新
   * @param id
   */
  updateRowByIdProxy: (
    id: Array<number | string> | number | string,
  ) => Promise<boolean | Record<number | string, boolean>>;
}

export type { SmartTableAction, SmartTableInnerActionType };
