<script setup lang="ts">
import type { CropendResult, Cropper, CropperProps } from './types';

import { computed, ref, unref, useAttrs } from 'vue';

import { useNamespace } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { VbenTooltip } from '@vben-core/shadcn-ui';
import { globalShareState } from '@vben-core/shared/global-state';

import BaseCropper from './components/base-cropper.vue';
import { TOOLBAR_BUTTON_LIST } from './constants';

interface Props extends CropperProps {}

const props = withDefaults(defineProps<Props>(), {
  realTimePreview: true,
});
const attrs = useAttrs();

const SmartIconButton = globalShareState.getComponent('IconButton');

const { b, e } = useNamespace('smart-cropper-image');

const previewSourceRef = ref('');
const cropperRef = ref<Cropper>();

let scaleX = 1;
let scaleY = 1;

const getImageContainerClass = computed(() => {
  const classList: string[] = [];
  if (props.showPreview) {
    classList.push(e('left'));
  }
  return classList;
});

const computedBaseCropperProps = computed(() => {
  return {
    ...props,
    ...attrs,
  };
});

const handlerToolbar = (action: string, arg?: number) => {
  if (action === 'scaleX') {
    scaleX = arg = scaleX === -1 ? 1 : -1;
  }
  if (action === 'scaleY') {
    scaleY = arg = scaleY === -1 ? 1 : -1;
  }
  // @ts-ignore
  unref(cropperRef)?.[action]?.(arg);
};

const handleAfterCrop = ({ imgBase64 }: CropendResult) => {
  previewSourceRef.value = imgBase64;
};

function handleReady(cropperInstance?: Cropper) {
  cropperRef.value = cropperInstance;
}
</script>

<template>
  <div :class="b()">
    <div :class="getImageContainerClass">
      <div :class="e('cropper')">
        <BaseCropper
          v-if="imgSrc"
          v-bind="computedBaseCropperProps"
          @after-crop="handleAfterCrop"
          @ready="handleReady"
        />
      </div>
      <div v-if="showToolbar" :class="e('toolbar')">
        <div :class="e('right-button')">
          <VbenTooltip
            v-for="item in TOOLBAR_BUTTON_LIST"
            :key="item.action + item.arg"
            :side="item.side as never"
          >
            <template #trigger>
              <SmartIconButton
                type="primary"
                size="small"
                :disabled="!imgSrc"
                :pre-icon="item.icon"
                @click="handlerToolbar(item.action, item.arg)"
              />
            </template>
            {{ t(item.labelI18n) }}
          </VbenTooltip>
        </div>
      </div>
    </div>
    <div v-if="showPreview" :class="e('right')">
      <div :class="e('preview')">
        <img
          :src="previewSourceRef"
          v-if="previewSourceRef"
          :alt="t('component.cropper.preview')"
        />
      </div>
      <template v-if="previewSourceRef">
        <div :class="e('preview-group')">12312312</div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
$namespace: vben;

.#{$namespace}-smart-cropper-image {
  display: flex;

  &__left {
    width: 55%;
  }

  &__right {
    width: 45%;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
  }

  &__right-button {
    display: inline-flex;
    gap: 5px;
  }

  &__preview {
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
