<script setup lang="ts">
import type { CropendResult, Cropper } from '../types';

import { ref } from 'vue';

import { useNamespace } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { useVbenModal } from '@vben-core/popup-ui';
import { VbenTooltip } from '@vben-core/shadcn-ui';
import { globalShareState } from '@vben-core/shared/global-state';

import SmartCropperImage from '../smart-cropper.vue';

interface Props {
  circled?: boolean;
  imgSrc?: string;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  circled: true,
  imgSrc: undefined,
  size: undefined,
});

const emit = defineEmits<{
  uploadError: [{ message: string }];
  uploadSuccess: [{ data: string; source: string }];
}>();

const Upload = globalShareState.getComponent('Upload');
const SmartIconButton = globalShareState.getComponent('IconButton');

const { b, e } = useNamespace('smart-cropper-modal');

const previewSourceRef = ref('');
const cropperRef = ref<Cropper>();
const imgSrcRef = ref(props.imgSrc || '');

let filename = '';

function handleCropend({ imgBase64 }: CropendResult) {
  previewSourceRef.value = imgBase64;
}
function handleReady(cropperInstance: Cropper) {
  cropperRef.value = cropperInstance;
}

const [RenderSmartCropperModal] = useVbenModal({});

/**
 * 上传图片前处理
 */
const handleBeforeUpload = (file: File) => {
  if (props.size !== undefined && file.size > 1024 * 1024 * props.size) {
    emit('uploadError', { message: t('component.cropper.imageTooBig') });
    return false;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  imgSrcRef.value = '';
  previewSourceRef.value = '';
  reader.addEventListener('load', (e) => {
    imgSrcRef.value = (e.target?.result as string) ?? '';
    filename = file.name;
  });
  // TODO: 无用代码
  if (filename) {
    return true;
  }
  return false;
};
</script>

<template>
  <RenderSmartCropperModal v-bind="$attrs">
    <div :class="b()">
      <div :class="e('left')">
        <div :class="e('cropper')">
          <SmartCropperImage
            v-if="imgSrc"
            :img-src="imgSrc"
            height="300px"
            :circled="circled"
            @cropend="handleCropend"
            @ready="handleReady"
          />
        </div>
        <div :class="e('toolbar')">
          <Upload
            :file-list="[]"
            accept="image/*"
            :before-upload="handleBeforeUpload"
          >
            <VbenTooltip>
              <template #trigger>
                <SmartIconButton
                  type="primary"
                  size="small"
                  pre-icon="ant-design:plus-outlined"
                />
              </template>
              {{ t('component.cropper.selectImage') }}
            </VbenTooltip>
          </Upload>
        </div>
      </div>
    </div>
  </RenderSmartCropperModal>
</template>

<style lang="scss" scoped>
$namespace: vben;

.#{$namespace}-smart-cropper-modal {
  &__left,
  &__right {
    height: 340px;
  }

  &__left {
    width: 55%;
  }
}
</style>
