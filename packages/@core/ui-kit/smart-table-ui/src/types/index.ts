import type { SupportedLanguagesType } from '@vben-core/preferences';
import type { DeepPartial } from '@vben-core/typings';
import type {
  VxeComponentSizeType,
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
  VxeTablePropTypes,
  VxeUIExport,
} from 'vxe-table';

import type { SmartTableApi } from '../smart-table-api';
import type { SmartSearchFormProps } from './SmartSearchFormType';
import type {
  SmartAddEditModalCallbackData,
  SmartTableAddEditConfig,
} from './SmartTableAddEditType';
import type { SmartTableProxyConfig } from './SmartTableAjaxType';
import type { SmartTableAuthConfig } from './SmartTableAuthType';
import type {
  SmartTableButton,
  SmartTableToolbarTool,
} from './SmartTableButtonType';
import type { SmartTableColumn } from './SmartTableColumnType';
import type {
  RowTriggerMode,
  SmartTableRowConfig,
  SmartTableSeqConfig,
} from './SmartTableRowType';
import type {
  SmartTableToolbarColumnConfig,
  SmartTableToolbarSizeSetting,
} from './SmartTableToolbarConfigType';

import type { Component, Ref } from 'vue';

/**
 * 表格高度
 */
type TableHeightType = 'auto' | number | string;

/**
 * table layout props
 */
interface SmartTableLayoutProps {
  showSearch?: boolean;
}

/**
 * 表格 checkbox配置
 */
interface SmartCheckboxConfig extends VxeTablePropTypes.CheckboxConfig {
  // 是否支持ctrl选中，rowTrigger必须为single
  rowCtrl?: boolean;
  // 是否支持shift多选，rowTrigger必须为single
  rowShift?: boolean;
  // 是否支持行触发选中
  rowTrigger?: RowTriggerMode;
}

interface SmartTableToolbarConfig
  extends Omit<VxeGridPropTypes.ToolbarConfig, 'buttons'> {
  buttons?: SmartTableButton[];
  column?: boolean | SmartTableToolbarColumnConfig;
  // 是否显示搜索
  showSearch?: boolean | SmartTableToolbarTool;
  // 尺寸配置
  sizeSetting?: boolean | SmartTableToolbarSizeSetting;
  tools?: SmartTableToolbarTool[];
}

/**
 * SmartTable 支持的函数
 */
interface SmartTableActions {
  abc?: string;
}

/**
 * 表格尺寸 TODO：tiny未支持
 */
type SmartTableSize = 'small' & VxeComponentSizeType;

interface SmartTableRenderProps<T = any>
  extends Omit<
    VxeGridProps<T>,
    | 'checkboxConfig'
    | 'columns'
    | 'pagerConfig'
    | 'seqConfig'
    | 'size'
    | 'toolbarConfig'
  > {
  // 添加修改配置
  addEditConfig?: SmartTableAddEditConfig;
  authConfig?: SmartTableAuthConfig;
  // checkbox配置
  checkboxConfig?: boolean | SmartCheckboxConfig;
  columns?: SmartTableColumn[];
  height?: TableHeightType;
  // 分页配置
  pagerConfig?: boolean | VxeGridPropTypes.PagerConfig;
  proxyConfig?: SmartTableProxyConfig;
  rowConfig?: SmartTableRowConfig;
  // 搜索表单配置
  searchFormConfig?: SmartSearchFormProps;
  seqConfig?: SmartTableSeqConfig;
  size?: SmartTableSize;
  toolbarConfig?: SmartTableToolbarConfig;
  // 是否使用搜索表单
  useSearchForm?: boolean;
}

/**
 * SmartTable事件
 */
interface SmartTableRenderListeners<D = any> extends VxeGridListeners<D> {
  // TODO: 移除
  abc: string;
}

/**
 * SmartTable props
 */
interface SmartTableProps<T = any> extends SmartTableRenderProps<T> {
  abc?: string;
}

/**
 * store props
 */
interface SmartTableStoreData<T = any> {
  gridOptions?: DeepPartial<SmartTableProps<T>>;
}

/**
 * Smart Table API
 */
type ExtendSmartTableApi = {
  useStore: <T = NoInfer<SmartTableStoreProps>>(
    selector?: (state: NoInfer<SmartTableStoreProps>) => T,
  ) => Readonly<Ref<T>>;
} & SmartTableApi;

/**
 * 初始化表格接口
 */
interface SetupSmartTable {
  components?: Partial<Record<string, Component>>;
  configSmartTable: (ui: VxeUIExport) => void;
  i18nHandler: (key: string, args?: any) => string;
  watcherField: Ref<{ locale: SupportedLanguagesType; theme: string }>;
}

export type {
  ExtendSmartTableApi,
  SetupSmartTable,
  SmartAddEditModalCallbackData,
  SmartCheckboxConfig,
  SmartTableActions,
  SmartTableColumn,
  SmartTableLayoutProps,
  SmartTableProps,
  SmartTableRenderListeners,
  SmartTableRenderProps,
  SmartTableSize,
  SmartTableStoreData,
};
