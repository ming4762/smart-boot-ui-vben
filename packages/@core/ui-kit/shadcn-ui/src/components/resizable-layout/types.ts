import type { ClassType } from '@vben-core/typings';

export type ResizableLayoutDirection = 'horizontal' | 'vertical';
export type ResizableLayoutResizeMode = 'preview' | 'realtime';
export type ResizableLayoutSizeUnit = '%' | 'px';

/** 可调整尺寸的双区域布局属性。 */
export interface ResizableLayoutProps {
  /** 根容器的自定义类名。 */
  class?: ClassType;
  /** 布局方向。 @default 'horizontal' */
  direction?: ResizableLayoutDirection;
  /** 分割线尺寸，数字按像素处理。 @default 1 */
  dividerSize?: number | string;
  /** 第一块面板折叠后的尺寸。 */
  firstCollapsedSize?: number;
  /** 第一块面板是否允许折叠。 */
  firstCollapsible?: boolean;
  /** 第一块面板的最大尺寸。 */
  firstMaxSize?: number;
  /** 第一块面板的最小尺寸。 */
  firstMinSize?: number;
  /** 第一块面板的初始尺寸。 */
  firstSize?: number;
  /** 第一块面板的尺寸单位，优先级高于 sizeUnit。 */
  firstSizeUnit?: ResizableLayoutSizeUnit;
  /** 是否允许拖动调整面板尺寸。 @default true */
  resizable?: boolean;
  /** 指针拖动时实时调整面板，或仅显示预览线并在松开后调整；键盘调整始终由 Reka UI 实时处理。 @default 'realtime' */
  resizeMode?: ResizableLayoutResizeMode;
  /** 第二块面板折叠后的尺寸。 */
  secondCollapsedSize?: number;
  /** 第二块面板是否允许折叠。 */
  secondCollapsible?: boolean;
  /** 第二块面板的最大尺寸。 */
  secondMaxSize?: number;
  /** 第二块面板的最小尺寸。 */
  secondMinSize?: number;
  /** 第二块面板的初始尺寸。 */
  secondSize?: number;
  /** 第二块面板的尺寸单位，优先级高于 sizeUnit。 */
  secondSizeUnit?: ResizableLayoutSizeUnit;
  /** 是否显示分割线。 @default false */
  showDivider?: boolean;
  /** 是否在分割线上显示拖动手柄。 @default true */
  showHandle?: boolean;
  /** 两块面板共用的默认尺寸单位。 @default '%' */
  sizeUnit?: ResizableLayoutSizeUnit;
}

/** 可调整尺寸布局对外触发的事件。 */
export interface ResizableLayoutEmits {
  /** 分割线拖动状态发生变化。 */
  dragging: [isDragging: boolean];
  /** 第一块面板折叠。 */
  firstCollapse: [];
  /** 第一块面板展开。 */
  firstExpand: [];
  /** 第一块面板尺寸发生变化。 */
  firstResize: [size: number, previousSize: number | undefined];
  /** 整体布局尺寸发生变化。 */
  layout: [sizes: number[]];
  /** 第二块面板折叠。 */
  secondCollapse: [];
  /** 第二块面板展开。 */
  secondExpand: [];
  /** 第二块面板尺寸发生变化。 */
  secondResize: [size: number, previousSize: number | undefined];
}
