<template>
  <div class="smart-layout-separate" :class="cssModule.layout">
    <div class="smart-first-container" :style="layoutStyle.firstStyle">
      <div :class="computedFirstContainerClass">
        <slot name="first"></slot>
      </div>
      <div
        v-if="showLine"
        ref="dividerRef"
        :style="dragLineStyle"
        :class="computedLineClass"
        @mousedown="handleMouseDown"
      >
        <Divider :style="lineStyle" :type="isLeftRight ? 'vertical' : 'horizontal'" />
      </div>
    </div>
    <div :class="computedSecondContainerClass" :style="layoutStyle.secondStyle">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script lang="tsx">
  import { SmartLayoutSeparateLayout } from './types';
  import { isFinite, endsWith, replace, parseInt, toNumber } from 'lodash-es';
  import { defineComponent, computed, toRefs, ref, watch, unref, useCssModule } from 'vue';
  import type { PropType, Ref, StyleValue } from 'vue';
  import { Divider } from 'ant-design-vue';

  const sizeType = {
    type: [Number, String] as PropType<number | string>,
    validator(value: string | number) {
      if (!isFinite(value)) {
        // @ts-ignore
        return endsWith(value, '%') || endsWith(value, 'px');
      }
      return true;
    },
  };

  export default defineComponent({
    name: 'SmartLayoutSeparate',
    components: {
      Divider,
    },
    props: {
      //布局，默认左右布局
      layout: {
        type: String as PropType<SmartLayoutSeparateLayout>,
        default: 'leftRight',
        validator(value: string) {
          // @ts-ignore
          return ['leftRight', 'topBottom'].includes(value);
        },
      },
      // 是否可拖拽
      draggable: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // 尺寸，如果是number类型，按照百分比分隔
      firstSize: sizeType,
      secondSize: sizeType,
      showLine: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      lineStyle: {
        type: [Object, String] as PropType<StyleValue | string>,
      },
      highLineStyle: {
        type: [Object, String] as PropType<StyleValue | string>,
        default: () => {
          return {
            'border-left': '2px solid rgb(24, 144, 255)',
          };
        },
      },
    },
    setup(props) {
      const { layout, draggable, firstSize, secondSize, showLine } = toRefs(props);
      if (unref(firstSize) && unref(secondSize)) {
        throw new Error('firstSize和secondSize不能同时设置');
      }
      if (!unref(firstSize) && !unref(secondSize)) {
        firstSize.value = 50;
      }
      const cssModule = useCssModule(unref(layout));
      // 是否是设置了第一尺寸
      const computedIsFirstSize = computed(() => unref(firstSize) !== undefined);
      // 是否是左右布局
      const isLeftRight = computed(() => layout.value === 'leftRight');
      // 拖拽是否初始化
      const dividerRef = ref<HTMLElement | null>(null);
      const dragVue = useDrag(isLeftRight, draggable);

      /**
       * 分割线class
       */
      const computedLineClass = computed(() => {
        // 分割线样式
        const dividerClassList: Array<string> = [cssModule['drag-line'], 'drag-line'];
        // 添加高亮设置
        if (dragVue.isMouseDown && dragVue.isMouseDown.value === true) {
          dividerClassList.push('high-light');
        }
        if (draggable.value) {
          dividerClassList.push(cssModule['draggable']);
        }
        return dividerClassList;
      });

      /**
       * layout样式计算属性
       */
      const layoutStyle = computed(() => {
        const { xLength, yLength } = dragVue;
        const firstStyle: StyleValue = {};
        const firstSizeValue = firstSize.value;
        const secondSizeValue = unref(secondSize);
        const sizeValue = firstSizeValue || secondSizeValue;
        const isFirstSize = unref(computedIsFirstSize);
        let firstValue = '';
        let secondValue = '';
        const addValue = isLeftRight.value ? xLength.value : yLength.value;
        if (isFinite(sizeValue) || isFinite(toNumber(sizeValue))) {
          // 按照百分比处理
          if (isFirstSize) {
            firstValue = toNumber(sizeValue) + addValue + 'px';
            secondValue = `calc(100% - ${firstValue})`;
          } else {
            secondValue = toNumber(sizeValue) - addValue + 'px';
            firstValue = `calc(100% - ${secondValue})`;
          }
        } else {
          // @ts-ignore
          if (endsWith(sizeValue, '%')) {
            // @ts-ignore
            const size = parseInt(replace(sizeValue, '%'));
            if (isFirstSize) {
              firstValue = `calc(${size}% ${addValue > 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
              secondValue = `calc(${100 - size}% ${addValue < 0 ? '+' : '-'} ${Math.abs(
                addValue,
              )}px)`;
            } else {
              secondValue = `calc(${size}% ${addValue < 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
              firstValue = `calc(${100 - size}% ${addValue > 0 ? '+' : '-'} ${Math.abs(addValue)}px)`;
            }
            // @ts-ignore
          } else if (endsWith(sizeValue, 'px')) {
            // @ts-ignore
            const size = parseInt(replace(sizeValue, 'px'));
            if (isFirstSize) {
              firstValue = size + addValue + 'px';
              secondValue = `calc(100% - ${firstValue})`;
            } else {
              secondValue = size - addValue + 'px';
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

      const computedFirstContainerClass = computed(() => {
        const classList = ['full-height'];
        if (showLine.value) {
          classList.push(cssModule['first-outer']);
        }
        return classList;
      });

      const computedSecondContainerClass = computed(() => {
        const classList: string[] = [];
        if (showLine.value) {
          classList.push(cssModule['second-outer']);
        }
        return classList;
      });

      const handleMouseDown = (event: MouseEvent) => {
        draggable.value && dragVue.onLineMouseDown && dragVue.onLineMouseDown(event);
      };
      return {
        layoutStyle,
        computedFirstContainerClass,
        dividerRef,
        ...dragVue,
        computedLineClass,
        handleMouseDown,
        isLeftRight,
        computedSecondContainerClass,
        cssModule,
      };
    },
  });
  /**
   * 支持拖拽
   * @param isLeftRight 是否是左右布局
   * @param draggable
   */
  const useDrag = (isLeftRight: Ref<boolean>, draggable: Ref<boolean>) => {
    // 鼠标是否按下
    const isMouseDown = ref(false);
    // 鼠标拖动时 lined XY坐标
    const lineDownX = ref(0);
    const lineDownY = ref(0);
    // 初始化状态的 x y位置
    let initX = -1;
    let initY = -1;
    let lineDefaultX = -1;
    let lineDefaultY = -1;
    // 分割线样式
    const dragLineStyle = ref<StyleValue>();
    // 左右方向移动距离
    const xLength = ref(0);
    // Y方向移动距离
    const yLength = ref(0);

    /**
     * 重置函数
     */
    const reset = () => {
      initX = -1;
      initY = -1;
      lineDefaultX = -1;
      lineDefaultY = -1;
      lineDownX.value = 0;
      lineDownY.value = 0;
      xLength.value = 0;
      yLength.value = 0;
    };

    watch([isLeftRight, draggable], reset);

    /**
     * 监控 x y 变化改变line样式
     */
    watch([lineDownX, lineDownY], () => {
      if (lineDefaultX === -1 || lineDefaultY === -1) {
        return;
      }
      if (isLeftRight.value) {
        dragLineStyle.value = {
          right: lineDefaultX - lineDownX.value - 5 + 'px',
        };
      } else {
        dragLineStyle.value = {
          bottom: lineDefaultY - lineDownY.value - 5 + 'px',
        };
      }
    });
    /**
     * 分割线鼠标点击事件
     */
    const onLineMouseDown = (downE: MouseEvent) => {
      if (initX === -1) {
        initX = downE.clientX;
      }
      if (initY === -1) {
        initY = downE.clientY;
      }

      lineDefaultX = downE.clientX;
      lineDefaultY = downE.clientY;

      isMouseDown.value = true;
      document.onmousemove = (e) => {
        lineDownX.value = e.clientX;
        lineDownY.value = e.clientY;
      };
      document.onmouseup = (e) => {
        xLength.value = e.clientX - initX;
        yLength.value = e.clientY - initY;

        dragLineStyle.value = {};
        isMouseDown.value = false;
        // 移除响应事件
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    return {
      onLineMouseDown,
      isMouseDown,
      dragLineStyle,
      xLength,
      yLength,
    };
  };
</script>

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

      .ant-divider {
        border-inline-start: 0;
      }

      &.high-light {
        //  线高亮
        .ant-divider-horizontal {
          border-top: @line_high_light;
        }

        .ant-divider-vertical {
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

      :global(.ant-divider-vertical) {
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

      :global(.ant-divider-horizontal) {
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
