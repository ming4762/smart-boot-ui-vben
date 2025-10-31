/**
 * 复制文本图标位置
 *  - end: 文本末尾
 *  - left: 文本左侧
 *  - right: 文本右侧
 */
export type IconPosition = 'end' | 'left' | 'right';
export type ShowMode = 'always' | 'hover';

export interface CopyTextProps {
  text: string;
  iconPosition?: IconPosition;
  // 图标与文本间距
  margin?: number;
  // 显示模式
  showMode?: ShowMode;
  // 文本不存在是否显示图标
  noTextVisible?: boolean;
  // 自定义图标
  icon?: string;
}

export interface CopyTextIconEmits {
  copy: [string];
}
