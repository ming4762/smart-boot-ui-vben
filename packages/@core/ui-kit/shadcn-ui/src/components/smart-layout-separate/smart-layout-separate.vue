<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, unref, useCssModule, useTemplateRef } from 'vue';

import { useDrag } from './hooks/useDrag';

type SmartLayoutSeparateLayout = 'leftRight' | 'topBottom';
interface Props {
  draggable?: boolean;
  firstSize?: number | string;
  highLineStyle?: string | StyleValue;
  layout?: SmartLayoutSeparateLayout;
  lineStyle?: string | StyleValue;
  secondSize?: number | string;
  showLine?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
  highLineStyle: () => {
    return {
      'border-left': '2px solid rgb(24, 144, 255)',
    };
  },
  layout: 'leftRight',
  showLine: true,
});

const cssModule = useCssModule(props.layout);

const dividerRef = useTemplateRef<HTMLElement | null>('dividerRef');
// 是否是左右布局
const isLeftRight = computed(() => props.layout === 'leftRight');
// 是否是设置了第一尺寸
const computedIsFirstSize = computed(() => props.firstSize !== undefined);

const { dragLineStyle, isMouseDown, onLineMouseDown, xLength, yLength } =
  useDrag(
    isLeftRight,
    computed(() => props.draggable),
  );
const layoutStyle = computed(() => {
  const firstStyle: StyleValue = {};
  const firstSizeValue = props.firstSize;
  const secondSizeValue = props.secondSize;
  const sizeValue = firstSizeValue || secondSizeValue;
  const isFirstSize = unref(computedIsFirstSize);
  let firstValue = '';
  let secondValue = '';
  const addValue = unref(isLeftRight) ? xLength.value : yLength.value;
  if (Number.isFinite(sizeValue) || Number.isFinite(Number(sizeValue))) {
    // 按照百分比处理
    if (isFirstSize) {
      firstValue = `${Number(sizeValue) + addValue}px`;
      secondValue = `calc(100% - ${firstValue})`;
    } else {
      secondValue = `${Number(sizeValue) - addValue}px`;
      firstValue = `calc(100% - ${secondValue})`;
    }
  } else {
    if ((sizeValue as string).endsWith('%')) {
      const size = Number.parseInt((sizeValue as string).replace('%', ''));
      if (isFirstSize) {
        firstValue = `calc(${size}% ${addValue > 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
        secondValue = `calc(${100 - size}% ${addValue < 0 ? '+' : '-'} ${Math.abs(
          addValue,
        )}px)`;
      } else {
        secondValue = `calc(${size}% ${addValue < 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
        firstValue = `calc(${100 - size}% ${addValue > 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
      }
    } else if ((sizeValue as string).endsWith('px')) {
      const size = Number.parseInt((sizeValue as string).replace('px', ''));
      if (isFirstSize) {
        firstValue = `${size + addValue}px`;
        secondValue = `calc(100% - ${firstValue})`;
      } else {
        secondValue = `${size - addValue}px`;
        firstValue = `calc(100% - ${secondValue})`;
      }
    }
  }
  const secondStyle: any = {};
  if (isLeftRight.value) {
    firstStyle.width = firstValue;
    secondStyle.width = secondValue;
  } else {
    firstStyle.height = firstValue;
    secondStyle.height = secondValue;
  }
  return {
    firstStyle,
    secondStyle,
  };
});

/**
 * 分割线class
 */
const computedLineClass = computed(() => {
  // 分割线样式
  const dividerClassList: Array<string> = [cssModule['drag-line'], 'drag-line'];
  // 添加高亮设置
  if (unref(isMouseDown) === true) {
    dividerClassList.push('high-light');
  }
  if (props.draggable) {
    dividerClassList.push(cssModule.draggable);
  }
  return dividerClassList;
});

const computedFirstContainerClass = computed(() => {
  const classList = ['h-full'];
  if (props.showLine) {
    classList.push(cssModule['first-outer']);
  }
  return classList;
});

const computedSecondContainerClass = computed(() => {
  const classList: string[] = [];
  if (props.showLine) {
    classList.push(cssModule['second-outer']);
  }
  return classList;
});

const handleMouseDown = (event: MouseEvent) => {
  props.draggable && onLineMouseDown && onLineMouseDown(event);
};

const computedDragLineInnerClass = computed(() => {
  return unref(isLeftRight) ? 'drag-line-vertical' : 'drag-line-horizontal';
});
</script>

<template>
  <div :class="cssModule.layout" class="smart-layout-separate">
    <div :style="layoutStyle.firstStyle" class="smart-first-container">
      <div :class="computedFirstContainerClass">
        <slot name="first"></slot>
      </div>
      <div
        v-if="showLine"
        ref="dividerRef"
        :class="computedLineClass"
        :style="dragLineStyle"
        @mousedown="handleMouseDown"
      >
        <div
          :class="computedDragLineInnerClass"
          :style="lineStyle"
          class="drag-line-inner"
        ></div>
      </div>
    </div>
    <div :class="computedSecondContainerClass" :style="layoutStyle.secondStyle">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<style lang="less">
@line_high_light: 2px solid rgb(24, 144, 255) !important;

.smart-layout-separate {
  display: flex;

  .smart-first-container {
    position: relative;
  }
  //
  .smart-second-container {
    position: relative;
  }
  // 左右布局
  // 上下布局
  // 分割线样式
  .drag-line {
    position: absolute;
    z-index: 1;

    .drag-line-inner {
      border-inline-start: 0;
    }

    &.high-light {
      //  线高亮
      .drag-line-horizontal {
        border-top: @line_high_light;
      }

      .drag-line-vertical {
        border-left: @line_high_light;
      }
    }
  }
}
</style>

<style lang="less" module="leftRight">
.layout {
  flex-direction: row;
  // 分割线样式
  .drag-line {
    z-index: 9999;
    top: 0;
    right: -5px;
    bottom: 0;
    width: 6px;
    height: 100%;
    :global(.drag-line-vertical) {
      width: 2px;
      height: 100%;
      margin: 0 4px;
    }
  }

  .draggable {
    cursor: col-resize;
  }
  // 第二个div样式
  .second-outer {
    padding-left: 5px;
    //margin-left: 6px;
  }

  .first-outer {
    margin-left: 0;
  }
}
</style>
<style lang="less" module="topBottom">
.layout {
  flex-direction: column;
  // 分割线样式
  .drag-line {
    //z-index: 9999;
    right: 0;
    bottom: -5px;
    left: 0;
    height: 10px;

    :global(.drag-line-horizontal) {
      height: 2px;
      margin: 4px 0;
    }
  }

  .draggable {
    cursor: row-resize;
  }

  .first-outer {
    margin-bottom: 5px;
  }

  .second-outer {
    padding-top: 5px;
    //margin-top: 5px;
  }
}
</style>
