import type { VxeTablePropTypes } from 'vxe-table';

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

export type { RowTriggerMode, SmartTableSeqConfig };
