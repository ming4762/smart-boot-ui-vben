import type {
  VxeColumnSlotTypes,
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

type SmartColumnDynamicClass =
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
    }) => { [key: string]: boolean } | null | string)
  | string;

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
    }) => { [key: string]: boolean } | null | string)
  | any;

type SmartColumnAutoClass = 'Boolean';

/**
 * 列配置
 */
interface SmartTableColumn extends VxeTableDefines.ColumnOptions {
  // 自动class
  autoClass?: SmartColumnAutoClass;
  component?: SmartTableColumnComponent;
  componentProps?:
    | ((params: VxeColumnSlotTypes.DefaultSlotParams) => Record<string, any>)
    | Record<string, any>;
  // 动态CLASS
  dynamicClass?: SmartColumnDynamicClass;
  // 动态style
  dynamicStyle?: SmartColumnDynamicStyle;
  flag?: 'ACTION' | 'CHECKBOX' | 'DEFAULT' | 'INDEX' | 'RADIO';
}

export type { SmartTableColumn };
