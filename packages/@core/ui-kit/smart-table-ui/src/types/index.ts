import type { ExtendedFormApi } from '@vben-core/form-ui';
import type { SupportedLanguagesType } from '@vben-core/preferences';
import type {
  VxeComponentSizeType,
  VxeGridDefines,
  VxeGridInstance,
  VxeGridProps,
  VxeGridPropTypes,
  VxeTablePropTypes,
  VxeUIExport,
} from 'vxe-table';

import type { SmartTableApi } from '../smart-table-api';
import type {
  SmartSearchFormProps,
  SmartSearchFormSchema,
} from './SmartSearchFormType';
import type { SmartTableAddEditConfig } from './SmartTableAddEditType';
import type {
  SmartTableAjaxQueryParams,
  SmartTableFetchParams,
  SmartTableProxyAjax,
  SmartTableProxyConfig,
} from './SmartTableAjaxType';
import type { SmartTableAuthConfig } from './SmartTableAuthType';
import type {
  SmartTableButton,
  SmartTableToolbarTool,
} from './SmartTableButtonType';
import type { SmartTableColumn } from './SmartTableColumnType';
import type { SmartTableMessageHandler } from './SmartTableMessageType';
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
  deleteByCheckbox: () => Promise<boolean | undefined>;
  getAddEditForm: () => ExtendedFormApi;
  getGrid: () => VxeGridInstance;
  getSearchForm: () => ExtendedFormApi;
  query: (params?: SmartTableFetchParams) => Promise<void>;
  setLoading: (loading: boolean) => void;
  // 打开添加modal
  showAddModal: () => void;
}

/**
 * 表格尺寸 TODO：tiny未支持
 */
type SmartTableSize = 'tiny' | VxeComponentSizeType;

interface SmartTableRenderProps
  extends Omit<
    VxeGridProps,
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
type SmartTableRenderListeners = {
  addEditModalShow: [
    {
      formData: Record<string, any>;
      isAdd: boolean;
      selectData: Record<string, any>;
    },
  ];
  afterSaveUpdate: [boolean];
  cellClick: [VxeGridDefines.CellClickEventParams];
  formQuery: [];
  'proxy-query': [any];
  proxyDelete: [{ status: boolean }];
  register: [SmartTableActions];
};

/**
 * SmartTable props
 */
interface SmartTableProps extends SmartTableRenderProps {
  abc?: string;
}

/**
 * Smart Table API
 */
type ExtendSmartTableApi = {
  useStore: <T = NoInfer<SmartTableProps>>(
    selector?: (state: NoInfer<SmartTableProps>) => T,
  ) => Readonly<Ref<T>>;
} & SmartTableApi;

/**
 * 初始化表格接口
 */
interface SetupSmartTable {
  components?: Partial<Record<string, Component>>;
  configSmartTable: (ui: VxeUIExport) => void;
  i18nHandler: (key: string, args?: any) => string;
  messageHandler?: SmartTableMessageHandler;
  watcherField: Ref<{ locale: SupportedLanguagesType; theme: string }>;
}

export type {
  ExtendSmartTableApi,
  SetupSmartTable,
  SmartCheckboxConfig,
  SmartSearchFormSchema,
  SmartTableActions,
  SmartTableAjaxQueryParams,
  SmartTableColumn,
  SmartTableFetchParams,
  SmartTableLayoutProps,
  SmartTableProps,
  SmartTableProxyAjax,
  SmartTableRenderListeners,
  SmartTableRenderProps,
  SmartTableSize,
};
