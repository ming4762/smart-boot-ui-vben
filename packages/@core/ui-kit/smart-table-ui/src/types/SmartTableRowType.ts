import type { Options as SortableOptions } from 'sortablejs';
import type { VxeTablePropTypes } from 'vxe-table';

/**
 * 行拖拽配置
 */
interface SmartTableRowDragConfig extends SortableOptions {
  // 是否自定义
  custom?: boolean;
  icon?: string;
}

interface SmartTableRowConfig extends VxeTablePropTypes.RowConfig {
  dragConfig?: boolean | SmartTableRowDragConfig;
}

/**
 * 行触发模式，单选/多选
 */
type RowTriggerMode = 'multiple' | 'single';

/**
 * 序号配置项
 */
interface SmartTableSeqConfig extends VxeTablePropTypes.SeqConfig {
  // 序号是否绑定分页
  seqBindPage?: boolean;
}

export type { RowTriggerMode, SmartTableRowConfig, SmartTableSeqConfig };
