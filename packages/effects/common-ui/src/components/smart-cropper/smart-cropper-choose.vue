<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { CropperChooseProps } from './types';

import { computed, ref, unref } from 'vue';

import { useNamespace } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';

import { useVbenModal } from '@vben-core/popup-ui';
import { globalShareState } from '@vben-core/shared/global-state';

import SmartCropperModal from './components/smart-cropper-modal.vue';

interface Props extends CropperChooseProps {}

const props = withDefaults(defineProps<Props>(), {
  width: '200px',
  showButton: true,
  size: 5,
  buttonText: () => t('component.cropper.selectImage'),
});

const emit = defineEmits<{
  change: [{ data: string; source: string }];
  'update:value': [string];
}>();

const SmartIconButton = globalShareState.getComponent('IconButton');

const { b, e } = useNamespace('smart-cropper-choose');

const sourceValueRef = ref(props.value || '');

const [RenderSmartCropperModal, smartCropperModalApi] = useVbenModal({
  connectedComponent: SmartCropperModal,
  title: t('component.cropper.modalTitle'),
});

const getClass = computed(() => [b()]);
const getWidth = computed(() => `${`${props.width}`.replace(/px/, '')}px`);
const getStyle = computed((): CSSProperties => ({ width: unref(getWidth) }));
const getImageWrapperStyle = computed(
  (): CSSProperties => ({ width: unref(getWidth), height: unref(getWidth) }),
);

const handleOpenModal = () => {
  smartCropperModalApi.open();
};

function handleUploadSuccess({ source, data }: any) {
  sourceValueRef.value = source;
  emit('change', { source, data });
  globalShareState
    .getMessage()
    ?.success?.(t('component.cropper.uploadSuccess'));
}
</script>

<template>
  <div :class="getClass" :style="getStyle">
    <div
      :class="e('image-wrapper')"
      :style="getImageWrapperStyle"
      @click="handleOpenModal"
    >
      <div :class="e('image-mask')" :style="getImageWrapperStyle">
        <IconifyIcon icon="ant-design:cloud-upload-outlined" />
      </div>
      <img :src="sourceValueRef" v-if="sourceValueRef" alt="avatar" />
    </div>
    <SmartIconButton
      :class="e('upload-btn')"
      @click="handleOpenModal"
      v-if="showButton"
      v-bind="buttonProps"
    >
      {{ buttonText }}
    </SmartIconButton>
    <RenderSmartCropperModal
      :img-src="sourceValueRef"
      :size="size"
      @upload-success="handleUploadSuccess"
    />
  </div>
</template>

<style scoped></style>
