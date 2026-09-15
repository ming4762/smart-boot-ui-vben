<script setup lang="ts">
import type { StyleValue } from 'vue';

import type { ResizableLayoutEmits, ResizableLayoutProps } from './types';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../ui/resizable';

defineOptions({
  name: 'ResizableLayout',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ResizableLayoutProps>(), {
  direction: 'horizontal',
  dividerSize: 1,
  resizable: true,
  resizeMode: 'realtime',
  showDivider: false,
  showHandle: true,
  sizeUnit: '%',
});

const emit = defineEmits<ResizableLayoutEmits>();

const firstPanelRef = ref<InstanceType<typeof ResizablePanel>>();
const secondPanelRef = ref<InstanceType<typeof ResizablePanel>>();
const layoutHostRef = ref<HTMLElement>();
const previewDragging = ref(false);
const previewOffset = ref(0);
let groupResizeObserver: ResizeObserver | undefined;

interface PreviewDragState {
  availableSize: number;
  firstSize: number;
  groupSize: number;
  handleElement: HTMLElement;
  pointerId: number;
  startOffset: number;
  startPosition: number;
}

let previewDragState: null | PreviewDragState = null;

// 单侧尺寸单位优先级高于两侧共用的尺寸单位。
const firstUnit = computed(() => props.firstSizeUnit ?? props.sizeUnit);
const secondUnit = computed(() => props.secondSizeUnit ?? props.sizeUnit);
// 可拖动、显示分割线或显示手柄时，都需要渲染 ResizableHandle。
const showSeparator = computed(
  () => props.resizable || props.showDivider || props.showHandle,
);
const isPreviewMode = computed(() => props.resizeMode === 'preview');
const needsPixelMeasurement = computed(
  () => firstUnit.value === 'px' || secondUnit.value === 'px',
);
// 百分比布局无需测量；像素布局必须等宿主容器有有效尺寸后再创建 SplitterGroup。
const splitterReady = ref(!needsPixelMeasurement.value);
const dividerStyle = computed<StyleValue>(() => {
  const size =
    typeof props.dividerSize === 'number'
      ? `${props.dividerSize}px`
      : props.dividerSize;

  return {
    backgroundColor: props.showDivider ? undefined : 'transparent',
    flex: '0 0 auto',
    [props.direction === 'horizontal' ? 'width' : 'height']: size,
  };
});
const previewLineStyle = computed<StyleValue>(() => ({
  [props.direction === 'horizontal' ? 'left' : 'top']:
    `${previewOffset.value}px`,
}));

function getPointerPosition(event: PointerEvent) {
  return props.direction === 'horizontal' ? event.clientX : event.clientY;
}

/**
 * 等待 px 分栏的宿主容器首次可见，再创建底层 SplitterGroup。
 * Reka UI 在 0px 容器中无法生成初始 layout，之后调用 resize 会因 panelSize 为空触发断言。
 */
function observeInitialGroupSize() {
  groupResizeObserver?.disconnect();
  if (!needsPixelMeasurement.value) return;

  const hostElement = layoutHostRef.value;
  if (!hostElement) return;

  const rect = hostElement.getBoundingClientRect();
  const initialSize =
    props.direction === 'horizontal' ? rect.width : rect.height;
  if (initialSize > 0) {
    splitterReady.value = true;
    return;
  }

  groupResizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { height, width } = entry.contentRect;
    const currentSize = props.direction === 'horizontal' ? width : height;
    if (currentSize <= 0) return;

    groupResizeObserver?.disconnect();
    groupResizeObserver = undefined;
    splitterReady.value = true;
  });
  groupResizeObserver.observe(hostElement);
}

onMounted(observeInitialGroupSize);
onBeforeUnmount(() => groupResizeObserver?.disconnect());

/** 开始预览模式拖动，记录两个面板和分割线的初始位置。 */
function handlePreviewPointerDown(event: PointerEvent) {
  if (
    !props.resizable ||
    !isPreviewMode.value ||
    !event.isPrimary ||
    event.button !== 0
  ) {
    return;
  }

  const handleElement = event.currentTarget as HTMLElement;
  const groupElement = handleElement.parentElement;
  const firstElement = handleElement.previousElementSibling;
  const secondElement = handleElement.nextElementSibling;
  if (
    !groupElement ||
    !(firstElement instanceof HTMLElement) ||
    !(secondElement instanceof HTMLElement)
  ) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const groupRect = groupElement.getBoundingClientRect();
  const handleRect = handleElement.getBoundingClientRect();
  const firstRect = firstElement.getBoundingClientRect();
  const secondRect = secondElement.getBoundingClientRect();
  const isHorizontal = props.direction === 'horizontal';
  const groupStart = isHorizontal ? groupRect.left : groupRect.top;
  const handleStart = isHorizontal ? handleRect.left : handleRect.top;
  const handleSize = isHorizontal ? handleRect.width : handleRect.height;

  previewDragState = {
    availableSize:
      (isHorizontal ? firstRect.width : firstRect.height) +
      (isHorizontal ? secondRect.width : secondRect.height),
    firstSize: isHorizontal ? firstRect.width : firstRect.height,
    groupSize: isHorizontal ? groupRect.width : groupRect.height,
    handleElement,
    pointerId: event.pointerId,
    startOffset: handleStart - groupStart + handleSize / 2,
    startPosition: getPointerPosition(event),
  };
  previewOffset.value = previewDragState.startOffset;
  previewDragging.value = true;
  handleElement.setPointerCapture(event.pointerId);
  emit('dragging', true);
}

/** 预览模式拖动期间只更新高亮线位置，不改变面板尺寸。 */
function handlePreviewPointerMove(event: PointerEvent) {
  const state = previewDragState;
  if (!state || state.pointerId !== event.pointerId) {
    return;
  }

  const delta = getPointerPosition(event) - state.startPosition;
  previewOffset.value = Math.max(
    0,
    Math.min(state.startOffset + delta, state.groupSize),
  );
}

/** 结束预览拖动，并通过 Reka UI 提交最终面板尺寸。 */
function finishPreviewDrag(event: PointerEvent, commit: boolean) {
  const state = previewDragState;
  if (!state || state.pointerId !== event.pointerId) {
    return;
  }

  if (commit && state.availableSize > 0) {
    const delta = getPointerPosition(event) - state.startPosition;
    const firstSizeInPixels = Math.max(
      0,
      Math.min(state.firstSize + delta, state.availableSize),
    );
    const firstSize =
      firstUnit.value === 'px'
        ? firstSizeInPixels
        : (firstSizeInPixels / state.availableSize) * 100;
    resizeFirst(firstSize);
  }

  if (state.handleElement.hasPointerCapture(event.pointerId)) {
    state.handleElement.releasePointerCapture(event.pointerId);
  }
  previewDragState = null;
  previewDragging.value = false;
  emit('dragging', false);
}

function handlePreviewPointerUp(event: PointerEvent) {
  finishPreviewDrag(event, true);
}

function handlePreviewPointerCancel(event: PointerEvent) {
  finishPreviewDrag(event, false);
}

/** 阻止预览模式下的兼容鼠标/触摸事件被 Reka UI 再次处理。 */
function handlePreviewLegacyStart(event: Event) {
  if (isPreviewMode.value) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function handleDragging(isDragging: boolean) {
  if (!isPreviewMode.value) {
    emit('dragging', isDragging);
  }
}

/** 折叠第一块面板。 */
function collapseFirst() {
  firstPanelRef.value?.collapse();
}

/** 折叠第二块面板。 */
function collapseSecond() {
  secondPanelRef.value?.collapse();
}

/** 展开第一块面板。 */
function expandFirst() {
  firstPanelRef.value?.expand();
}

/** 展开第二块面板。 */
function expandSecond() {
  secondPanelRef.value?.expand();
}

/** 获取第一块面板当前尺寸，单位由 firstSizeUnit 或 sizeUnit 决定。 */
function getFirstSize() {
  return firstPanelRef.value?.getSize();
}

/** 获取第二块面板当前尺寸，单位由 secondSizeUnit 或 sizeUnit 决定。 */
function getSecondSize() {
  return secondPanelRef.value?.getSize();
}

function handleFirstResize(size: number, previousSize: number | undefined) {
  emit('firstResize', size, previousSize);
}

function handleSecondResize(size: number, previousSize: number | undefined) {
  emit('secondResize', size, previousSize);
}

/** 调整第一块面板尺寸，传入值使用第一块面板的尺寸单位。 */
function resizeFirst(size: number) {
  firstPanelRef.value?.resize(size);
}

/** 调整第二块面板尺寸，传入值使用第二块面板的尺寸单位。 */
function resizeSecond(size: number) {
  secondPanelRef.value?.resize(size);
}

defineExpose({
  collapseFirst,
  collapseSecond,
  expandFirst,
  expandSecond,
  getFirstSize,
  getSecondSize,
  resizeFirst,
  resizeSecond,
});
</script>

<template>
  <div
    ref="layoutHostRef"
    :class="cn('relative min-h-0 min-w-0', props.class)"
  >
    <ResizablePanelGroup
      v-if="splitterReady"
      v-bind="$attrs"
      class="h-full w-full"
      :direction="direction"
      @layout="emit('layout', $event)"
    >
      <ResizablePanel
        ref="firstPanelRef"
        class="min-h-0 min-w-0"
        :collapsed-size="firstCollapsedSize"
        :collapsible="firstCollapsible"
        :default-size="firstSize"
        :max-size="firstMaxSize"
        :min-size="firstMinSize"
        :size-unit="firstUnit"
        @collapse="emit('firstCollapse')"
        @expand="emit('firstExpand')"
        @resize="handleFirstResize"
      >
        <template #default="slotProps">
          <slot name="first" v-bind="slotProps"></slot>
        </template>
      </ResizablePanel>

      <ResizableHandle
        v-if="showSeparator"
        :disabled="!resizable"
        :hit-area-margins="isPreviewMode ? { coarse: 0, fine: 0 } : undefined"
        :style="dividerStyle"
        :with-handle="showHandle"
        @dragging="handleDragging"
        @mousedown="handlePreviewLegacyStart"
        @pointercancel="handlePreviewPointerCancel"
        @pointerdown="handlePreviewPointerDown"
        @pointermove="handlePreviewPointerMove"
        @pointerup="handlePreviewPointerUp"
        @touchstart="handlePreviewLegacyStart"
      />

      <ResizablePanel
        ref="secondPanelRef"
        class="min-h-0 min-w-0"
        :collapsed-size="secondCollapsedSize"
        :collapsible="secondCollapsible"
        :default-size="secondSize"
        :max-size="secondMaxSize"
        :min-size="secondMinSize"
        :size-unit="secondUnit"
        @collapse="emit('secondCollapse')"
        @expand="emit('secondExpand')"
        @resize="handleSecondResize"
      >
        <template #default="slotProps">
          <slot name="second" v-bind="slotProps"></slot>
        </template>
      </ResizablePanel>

      <div
        v-if="previewDragging"
        :class="
          cn(
            'bg-primary pointer-events-none absolute z-20',
            direction === 'horizontal'
              ? 'inset-y-0 w-0.5 -translate-x-1/2'
              : 'inset-x-0 h-0.5 -translate-y-1/2',
          )
        "
        :style="previewLineStyle"
      ></div>
    </ResizablePanelGroup>
  </div>
</template>
