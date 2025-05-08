<script setup lang="ts">
import type { Ref, StyleValue } from 'vue';

import { computed, toRefs, unref, useCssModule, useTemplateRef } from 'vue';

import { isNumber } from '@vben-core/shared/utils';

import { useDrag } from './hooks/useDrag';

type SmartLayoutSeparateLayout = 'leftRight' | 'topBottom';

interface Props {
  dividerSize?: string;
  draggable?: boolean;
  firstSize?: number | string;
  highLineStyle?: string | StyleValue;
  layout?: SmartLayoutSeparateLayout;
  lineStyle?: string | StyleValue;
  secondSize?: number | string;
  showDivider?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
  layout: 'leftRight',
  showDivider: false,
  highLineStyle: () => {
    return {
      background: 'rgba(0, 123, 255, 0.8)',
    };
  },
  dividerSize: '5px',
});

const {
  draggable: draggableRef,
  highLineStyle: highLineStyleRef,
  showDivider: showDividerRef,
} = toRefs(props);

const containerRef = useTemplateRef<HTMLElement>('containerRef');

const dividerRef = useTemplateRef<HTMLElement | null>('dividerRef');
const highlightLineRef = useTemplateRef<HTMLElement | null>('highlightLineRef');
const firstContainerRef = useTemplateRef<HTMLElement>('firstContainerRef');

// 是否是左右布局
const getIsLeftRight = computed(() => props.layout === 'leftRight');
// 是否是设置了第一尺寸
const computedIsFirstSize = computed(() => props.firstSize !== undefined);

const leftRightCssModule = useCssModule('leftRight');
const topBottomCssModule = useCssModule('topBottom');
const cssModule = computed(() => {
  return unref(getIsLeftRight) ? leftRightCssModule : topBottomCssModule;
});

const { onLineMouseDown, newSizeRef, isDraggingRef, lineOffsetRef } = useDrag(
  getIsLeftRight,
  draggableRef,
  computedIsFirstSize,
  containerRef as Ref<HTMLElement>,
  firstContainerRef as Ref<HTMLElement>,
  dividerRef,
  highlightLineRef,
);

/**
 * 鼠标按下事件
 * @param e
 */
const handleMouseDown = (e: MouseEvent) => {
  onLineMouseDown && onLineMouseDown(e);
};

const computedFlexStyle = computed(() => {
  const isLeftRight = unref(getIsLeftRight);
  return {
    flex: '1 1 0',
    ...(isLeftRight ? { 'min-width': 0 } : { 'min-height': 0 }),
  };
});

const computedFirstStyle = computed<StyleValue>(() => {
  if (!unref(computedIsFirstSize)) {
    return unref(computedFlexStyle);
  }
  const widthHeight = unref(getIsLeftRight) ? 'width' : 'height';
  if (unref(newSizeRef)) {
    return {
      [widthHeight]: `${unref(newSizeRef)}px`,
    };
  }
  return {
    [widthHeight]: isNumber(props.firstSize)
      ? `${props.firstSize}px`
      : props.firstSize,
  };
});

const computedSecondStyle = computed<StyleValue>(() => {
  if (unref(computedIsFirstSize)) {
    return unref(computedFlexStyle);
  }
  const widthHeight = unref(getIsLeftRight) ? 'width' : 'height';
  if (unref(newSizeRef)) {
    return {
      [widthHeight]: `${unref(newSizeRef)}px`,
    };
  }
  return {
    [widthHeight]: isNumber(props.secondSize)
      ? `${props.secondSize}px`
      : props.secondSize,
  };
});

/**
 * 分割线class
 */
const computedDividerClass = computed(() => {
  const classList: Array<string> = ['divider', unref(cssModule).divider];
  return classList;
});

const computedLineClass = computed(() => {
  const classList: Array<string> = [
    'highlight-line',
    unref(cssModule)['highlight-line'],
  ];
  return classList;
});

/**
 * 高亮线样式
 */
const computedLineStyle = computed<StyleValue>(() => {
  if (!unref(draggableRef)) {
    return {};
  }
  const lineStyle: StyleValue = {
    display: unref(isDraggingRef) ? 'block' : 'none',
  };
  if (unref(getIsLeftRight)) {
    lineStyle.left = `${unref(lineOffsetRef)}px`;
  } else {
    lineStyle.top = `${unref(lineOffsetRef)}px`;
  }
  return Object.assign(lineStyle, unref(highLineStyleRef));
});

const computedContainerStyle = computed(() => {
  if (!unref(isDraggingRef)) {
    return {};
  }
  return {
    cursor: unref(getIsLeftRight) ? 'col-resize' : 'row-resize',
  };
});

const computedDividerStyle = computed(() => {
  if (!unref(showDividerRef) && !unref(draggableRef)) {
    return {};
  }
  const widthHeight = unref(getIsLeftRight) ? 'width' : 'height';
  return {
    [widthHeight]: props.dividerSize,
  };
});
</script>

<template>
  <div
    :class="cssModule.layout"
    :style="computedContainerStyle"
    class="smart-layout-separate"
    ref="containerRef"
  >
    <!--  第一块  -->
    <div
      class="smart-first-container"
      ref="firstContainerRef"
      :style="computedFirstStyle"
    >
      <slot name="first"></slot>
    </div>
    <!--  分割线  -->
    <div
      :class="computedDividerClass"
      v-if="showDivider || draggable"
      ref="dividerRef"
      :style="computedDividerStyle"
      v-on="draggable ? { mousedown: handleMouseDown } : {}"
    ></div>
    <!--  第二块  -->
    <div class="smart-second-container" :style="computedSecondStyle">
      <slot name="second"></slot>
    </div>
    <!--  高亮线  -->
    <div
      :class="computedLineClass"
      :style="computedLineStyle"
      v-if="draggable"
      ref="highlightLineRef"
    ></div>
  </div>
</template>

<style lang="less">
.smart-layout-separate {
  position: relative;
  display: flex;
  user-select: none;

  .smart-first-container {
    overflow: auto;
  }
  .divider {
    background: hsl(var(--background-deep));
  }
  .highlight-line {
    position: absolute;
    top: 0;
    bottom: 0;
    pointer-events: none;
    display: none;
    z-index: 20;
  }
}
</style>

<style lang="less" module="leftRight">
.layout {
  flex-direction: row;
  .divider {
    cursor: col-resize;
  }
  .highlight-line {
    width: 2px;
    height: 100%;
  }
}
</style>
<style lang="less" module="topBottom">
.layout {
  flex-direction: column;
  .divider {
    cursor: row-resize;
  }
  .highlight-line {
    height: 2px;
    width: 100%;
  }
}
</style>
