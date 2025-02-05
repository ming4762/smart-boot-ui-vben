<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { Nullable } from '@vben/types';

import type { BaseCropperProps, CropperEvents } from '../types';

import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  unref,
  useAttrs,
  useTemplateRef,
} from 'vue';

import { useNamespace } from '@vben/hooks';

import { useDebounceFn } from '@vueuse/core';
import Cropper from 'cropperjs';

import { DEFAULT_CROPPER_OPTIONS } from '../constants';

import 'cropperjs/dist/cropper.css';

interface Props extends BaseCropperProps {}

defineOptions({
  name: 'SmartCropperImage',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<Props>(), {
  circled: false,
  height: '360px',
  imageStyle: () => ({}),
  options: () => ({}),
  realTimePreview: true,
});
const emit = defineEmits<CropperEvents>();
const attrs = useAttrs();

const { b, is } = useNamespace('base-cropper-image');

const isReady = ref(false);
const imgElRef = useTemplateRef<HTMLImageElement>('imgElRef');
const cropperRef = ref<Nullable<Cropper>>();

const getRoundedCanvas = () => {
  const sourceCanvas = unref(cropperRef)!.getCroppedCanvas();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.arc(
    width / 2,
    height / 2,
    Math.min(width, height) / 2,
    0,
    2 * Math.PI,
    true,
  );
  context.fill();
  return canvas;
};

const croppered = () => {
  const cropper = unref(cropperRef);
  if (!cropper) {
    return;
  }
  const imgInfo = cropper.getData();
  const canvas = props.circled
    ? getRoundedCanvas()
    : cropper.getCroppedCanvas();
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onloadend = (e) => {
      emit('afterCrop', {
        imgBase64: (e.target?.result ?? '') as string,
        imgInfo,
      });
    };
    fileReader.addEventListener('error', () => {
      emit('cropEndError');
    });
  }, 'image/png');
};

const realTimeCroppered = () => {
  props.realTimePreview && croppered();
};

const debounceRealTimeCroppered = useDebounceFn(realTimeCroppered, 80);

/**
 * @description: 初始化
 */
const init = () => {
  const imgEl = unref(imgElRef);
  if (!imgEl) {
    return;
  }
  cropperRef.value = new Cropper(imgEl, {
    ...DEFAULT_CROPPER_OPTIONS,
    crop() {
      debounceRealTimeCroppered();
    },
    cropmove() {
      debounceRealTimeCroppered();
    },
    ready: () => {
      isReady.value = true;
      realTimeCroppered();
      const cropper = unref(cropperRef);
      if (cropper) {
        emit('ready', cropper);
      }
    },
    zoom() {
      debounceRealTimeCroppered();
    },
    ...props.options,
  });
};

onMounted(() => {
  init();
});
onUnmounted(() => {
  cropperRef.value?.destroy();
});

const getClass = computed(() => {
  return [b(), attrs.class, is('circled', props.circled)];
});
const getWrapperStyle = computed((): CSSProperties => {
  return { height: `${`${props.height}`.replace(/px/, '')}px` };
});
const getImageStyle = computed((): CSSProperties => {
  return {
    height: props.height,
    maxWidth: '100%',
    ...props.imageStyle,
  };
});
</script>

<template>
  <div :class="getClass" :style="getWrapperStyle">
    <img
      ref="imgElRef"
      v-show="isReady"
      :src="imgSrc"
      :alt="alt"
      :crossorigin="crossOrigin"
      :style="getImageStyle"
    />
  </div>
</template>

<style lang="scss">
$namespace: vben;
.#{$namespace}-base-cropper-image {
  &.is-circled {
    .cropper-view-box,
    .cropper-face {
      border-radius: 50%;
    }
  }
}
</style>
