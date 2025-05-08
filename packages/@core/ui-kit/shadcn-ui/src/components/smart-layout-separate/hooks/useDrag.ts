import type { Ref } from 'vue';

import { onBeforeUnmount, ref, unref, watch } from 'vue';

export const useDrag = (
  isLeftRight: Ref<boolean>,
  draggableRef: Ref<boolean>,
  computedIsFirstSize: Ref<boolean>,
  containerRef: Ref<HTMLElement>,
  firstContainerRef: Ref<HTMLElement>,
  dividerRef: Ref<HTMLElement | null>,
  highlightLineRef: Ref<HTMLElement | null>,
) => {
  let startX = 0;
  let startY = 0;
  let startSize = 0;
  const threshold = 2;
  // 是否已添加事件
  let hasAddEventListener = false;
  const lineOffsetRef = ref(0);

  const isDraggingRef = ref(false);
  const newSizeRef = ref<null | number>(null);

  /**
   * 获取第一块的尺寸
   */
  const getFirstContainerSize = () => {
    const firstContainer = unref(firstContainerRef);
    return unref(isLeftRight)
      ? firstContainer.getBoundingClientRect().width
      : firstContainer.getBoundingClientRect().height;
  };

  /**
   * 鼠标点击事件
   */
  const onLineMouseDown = (downE: MouseEvent) => {
    isDraggingRef.value = true;
    startX = downE.clientX;
    startY = downE.clientY;
    startSize = getFirstContainerSize();
    const divRect = unref(dividerRef)?.getBoundingClientRect() as DOMRect;
    const containerRect = unref(containerRef).getBoundingClientRect();
    const highlightLineElement = unref(highlightLineRef) as HTMLElement;
    const centerLine = unref(isLeftRight)
      ? divRect.left + divRect.width / 2
      : divRect.top + divRect.height / 2;
    lineOffsetRef.value = unref(isLeftRight)
      ? centerLine - containerRect.left - highlightLineElement.offsetWidth / 2
      : centerLine - containerRect.top - highlightLineElement.offsetHeight / 2;
  };

  /**
   * 鼠标移动事件
   */
  const mousemoveHandler = (e: MouseEvent) => {
    if (!unref(draggableRef) || !unref(isDraggingRef)) {
      return;
    }
    const containerRect = unref(containerRef).getBoundingClientRect();
    let start = unref(isLeftRight)
      ? e.clientX - containerRect.left
      : e.clientY - containerRect.top;
    const min = 50;
    const max =
      (unref(isLeftRight) ? containerRect.width : containerRect.height) - 50;
    if (start < min) start = min;
    if (start > max) start = max;
    const highlightLineElement = unref(highlightLineRef) as HTMLElement;
    lineOffsetRef.value =
      start -
      (unref(isLeftRight)
        ? highlightLineElement.offsetWidth
        : highlightLineElement.offsetHeight) /
        2;
  };

  /**
   * 鼠标松开事件
   */
  const mouseupHandler = (e: MouseEvent) => {
    if (!unref(draggableRef) || !unref(isDraggingRef)) {
      return;
    }
    isDraggingRef.value = false;
    const delta = unref(isLeftRight) ? e.clientX - startX : e.clientY - startY;
    if (Math.abs(delta) >= threshold) {
      const widthHeight = unref(isLeftRight) ? 'width' : 'height';
      const firstSize = startSize + delta;
      const containerWidthHeight =
        unref(containerRef).getBoundingClientRect()[widthHeight];
      if (unref(computedIsFirstSize)) {
        newSizeRef.value = Math.max(
          50,
          Math.min(firstSize, containerWidthHeight - 50),
        );
      } else {
        const divRectSize =
          unref(dividerRef)?.getBoundingClientRect()?.[widthHeight] ?? 0;
        newSizeRef.value =
          containerWidthHeight -
          Math.max(50, Math.min(firstSize, containerWidthHeight - 50)) -
          divRectSize;
      }
    }
  };

  /**
   * 添加鼠标事件
   */
  watch(
    draggableRef,
    (draggable) => {
      if (draggable && !hasAddEventListener) {
        document.addEventListener('mousemove', mousemoveHandler);
        document.addEventListener('mouseup', mouseupHandler);
        hasAddEventListener = true;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('mouseup', mouseupHandler);
  });

  return {
    onLineMouseDown,
    isDraggingRef,
    newSizeRef,
    lineOffsetRef,
  };
};
