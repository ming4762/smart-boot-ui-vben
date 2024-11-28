import type { Ref, StyleValue } from 'vue';
import { ref, watch } from 'vue';

/**
 * 支持拖拽
 * @param isLeftRight 是否是左右布局
 * @param draggable
 */
export const useDrag = (isLeftRight: Ref<boolean>, draggable: Ref<boolean>) => {
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
    dragLineStyle.value = isLeftRight.value
      ? {
          right: `${lineDefaultX - lineDownX.value - 5}px`,
        }
      : {
          bottom: `${lineDefaultY - lineDownY.value - 5}px`,
        };
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
    const mousemoveHandler = (e: MouseEvent) => {
      lineDownX.value = e.clientX;
      lineDownY.value = e.clientY;
    };
    const mouseupHandler = (e: MouseEvent) => {
      xLength.value = e.clientX - initX;
      yLength.value = e.clientY - initY;

      dragLineStyle.value = {};
      isMouseDown.value = false;
      // 移除响应事件
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };
  return {
    dragLineStyle,
    isMouseDown,
    onLineMouseDown,
    xLength,
    yLength,
  };
};
