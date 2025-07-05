import type {
  VxeColumnPropTypes,
  VxeColumnSlotTypes,
  VxeGridPropTypes,
  VxeTableConstructor,
  VxeTableDefines,
  VxeTablePrivateMethods,
} from 'vxe-table';

/**
 * 列类型
 */
type SmartTableColumnComponent =
  | 'booleanTag'
  | 'button'
  | 'switch'
  | 'tag'
  | 'useYnTag';

type SmartColumnDynamicStyle =
  | ((params: {
      $columnIndex: number;
      $rowIndex: number;
      $table: VxeTableConstructor & VxeTablePrivateMethods;
      _columnIndex: number;
      _rowIndex: number;
      column: VxeTableDefines.ColumnInfo;
      columnIndex: number;
      row: any;
      rowIndex: number;
    }) => null | string | { [key: string]: boolean })
  | any;

type SmartColumnAutoClass = 'Boolean';

/**
 * 可编辑表格组件
 */
type SmartTableEditRenderName =
  | '$input'
  | '$select'
  | '$switch'
  | 'AAutocomplete'
  | 'AButton'
  | 'AButtons'
  | 'ACascader'
  | 'ADatePicker'
  | 'AInput'
  | 'AInputNumber'
  | 'AMonthPicker'
  | 'ARangePicker'
  | 'ARate'
  | 'ASelect'
  | 'ASwitch'
  | 'ATimePicker'
  | 'ATreeSelect'
  | 'AWeekPicker'
  | 'input'
  | 'select'
  | 'textarea';

type SmartTableEditRenderPropsHandler<D = any, P = Record<string, any>> = (
  row: D,
) => P;

type SmartTableColumnType = 'date' | 'dateTime' | VxeColumnPropTypes.Type;

/**
 * 可编辑编辑列配置
 */
interface SmartTableEditRender<D = any, P = Record<string, any>>
  extends Omit<VxeColumnPropTypes.EditRender<D, P>, 'autofocus' | 'props'> {
  autofocus?: boolean | string;
  name?: SmartTableEditRenderName;
  props?: P | SmartTableEditRenderPropsHandler;
  // 是否必填
  required?: boolean;
  // 校验规则
  rules?: VxeTableDefines.ValidatorRule[];
  // 是否阻止回车键事件冒泡，组织后回车不会调到下一行，默认true
  stopEnterBubbling?: boolean;
}

/**
 * 表格列动态class
 */
type SmartTableColumnDynamicClass =
  | ((params: {
      $columnIndex: number;
      $rowIndex: number;
      $table: VxeTableConstructor;
      _columnIndex: number;
      _rowIndex: number;
      column: VxeTableDefines.ColumnInfo;
      columnIndex: number;
      row: any;
      rowIndex: number;
    }) => null | string | { [key: string]: boolean })
  | string;

/**
 * 列格式化类型
 */
type SmartTableColumnFormatType = 'date' | 'datetime';
type SmartTableColumnFormat =
  | [SmartTableColumnFormatType, string]
  | SmartTableColumnFormatType
  | VxeColumnPropTypes.Formatter;

/**
 * 列配置
 */
interface SmartTableColumn
  extends Omit<VxeGridPropTypes.Column, 'editRender' | 'type'> {
  // 自动class
  autoClass?: SmartColumnAutoClass;
  component?: SmartTableColumnComponent;
  componentProps?:
    | ((params: VxeColumnSlotTypes.DefaultSlotParams) => Record<string, any>)
    | Record<string, any>;
  // 动态CLASS
  dynamicClass?: SmartTableColumnDynamicClass;
  // 动态style
  dynamicStyle?: SmartColumnDynamicStyle;
  editRender?: SmartTableEditRender;
  flag?: 'ACTION' | 'CHECKBOX' | 'DEFAULT' | 'INDEX' | 'RADIO';
  formatter?: SmartTableColumnFormat;
  type?: SmartTableColumnType;
}

/**
 * 表格列动态style
 */
type SmartTableColumnDynamicStyle =
  | ((params: {
      $columnIndex: number;
      $rowIndex: number;
      $table: VxeTableConstructor & VxeTablePrivateMethods;
      _columnIndex: number;
      _rowIndex: number;
      column: VxeTableDefines.ColumnInfo;
      columnIndex: number;
      row: any;
      rowIndex: number;
    }) => null | string | { [key: string]: boolean })
  | any;

type SmartTableColumnAutoClass = 'Boolean';

export type {
  SmartTableColumn,
  SmartTableColumnAutoClass,
  SmartTableColumnDynamicClass,
  SmartTableColumnDynamicStyle,
};
