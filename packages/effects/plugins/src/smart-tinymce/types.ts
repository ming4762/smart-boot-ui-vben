import type { Editor, EditorEvent, RawEditorOptions } from 'tinymce';

type ContentFormat = 'html' | 'raw' | 'text' | 'tree';

export interface SmartTinymceEditorProps {
  id?: string;
  licenseKey?: string;
  value?: string;
  /**
   * tinymce配置项
   */
  options?: Partial<RawEditorOptions>;
  language?: string;
  /**
   * 插件列表
   */
  plugins?: string[];
  /**
   * 工具栏
   */
  toolbar?: string[];
  /**
   * 输出格式
   */
  outputFormat?: ContentFormat;
  /**
   * 触发v-model事件
   */
  modelEvents?: string[];
  /**
   * 皮肤
   */
  skin?: string;
  width?: number | string;
  height?: number | string;
}

export interface SmartTinymceEditorEvents {
  'update:value': [string];
  change: [string];
  afterInit: [Editor[]];
  initError: [Error];
}

export type { ContentFormat, Editor, EditorEvent, RawEditorOptions };
