import type {
  VxeComponentSizeType,
  VxeGridProps,
  VxeGridPropTypes,
  VxeTableEventProps,
  VxeTablePropTypes,
} from 'vxe-table';

import type { VNode } from 'vue';

import type { VbenFormProps } from '@vben-core/form-ui';
import type { ClassType } from '@vben-core/typings';

import type { SmartSearchFormProps } from './SmartSearchFormType';
import type { SmartTableAddEditConfig } from './SmartTableAddEditType';
import type { SmartTableProxyConfig } from './SmartTableAjaxType';
import type { SmartTableAuthConfig } from './SmartTableAuthType';
import type {
  SmartTableButton,
  SmartTableToolbarTool,
} from './SmartTableButtonType';
import type { SmartTableColumn } from './SmartTableColumnType';
import type { RowTriggerMode, SmartTableSeqConfig } from './SmartTableRowType';
import type {
  SmartTableToolbarColumnConfig,
  SmartTableToolbarSizeSetting,
} from './SmartTableToolbarConfigType';

type SmartTableFormSlots =
  | Record<string, (data: any) => VNode | VNode[]>
  | string[];

interface SmartTableBasicFormConfig extends VbenFormProps {
  class?: string;
  slots?: SmartTableFormSlots;
}
/**
 * 表格尺寸 TODO：tiny未支持
 */
type SmartTableSize = 'tiny' | VxeComponentSizeType;

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

interface SmartTableToolbarConfig extends Omit<
  VxeGridPropTypes.ToolbarConfig,
  'buttons'
> {
  buttons?: SmartTableButton[];
  column?: boolean | SmartTableToolbarColumnConfig;
  // 是否显示搜索
  showSearch?: boolean | SmartTableToolbarTool;
  // 尺寸配置
  sizeSetting?: boolean | SmartTableToolbarSizeSetting;
  tools?: SmartTableToolbarTool[];
}

/**
 * 表格高度
 */
type TableHeightType = 'auto' | number | string;

interface SmartTableBasicProps {
  // 添加修改配置
  addEditConfig?: SmartTableAddEditConfig;
  authConfig?: SmartTableAuthConfig;
  // checkbox配置
  checkboxConfig?: boolean | SmartCheckboxConfig;
  class?: ClassType;
  columns?: SmartTableColumn[];
  height?: TableHeightType;
  // 分页配置
  pagerConfig?: boolean | VxeGridPropTypes.PagerConfig;
  proxyConfig?: SmartTableProxyConfig;
  // 搜索表单配置
  searchFormConfig?: SmartSearchFormProps;
  seqConfig?: SmartTableSeqConfig;
  size?: SmartTableSize;
  toolbarConfig?: SmartTableToolbarConfig;
  // 是否使用搜索表单
  useSearchForm?: boolean;
}

export type SmartTableRenderProps = Omit<
  VxeGridProps,
  | 'checkboxConfig'
  | 'columns'
  | 'pagerConfig'
  | 'proxyConfig'
  | 'seqConfig'
  | 'size'
  | 'toolbarConfig'
> &
  SmartTableBasicProps &
  VxeTableEventProps;

export type {
  SmartCheckboxConfig,
  SmartTableBasicFormConfig,
  SmartTableSize,
  SmartTableToolbarConfig,
};
