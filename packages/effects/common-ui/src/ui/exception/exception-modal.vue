<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';

import { useVbenModal } from '@vben-core/popup-ui';
import { globalShareState } from '@vben-core/shared/global-state';

interface FeedBack {
  exceptionNoList: number[];
  feedBackContent: string;
}

interface Props {
  open?: boolean;
  exceptionNoList?: number[];
  feedbackApi?: (feedback: FeedBack) => Promise<void>;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  exceptionNoList: undefined,
  feedbackApi: undefined,
});

const emit = defineEmits<{ hide: [] }>();

const model = reactive({
  feedbackMessage: '',
});
const submitLoading = ref(false);

const RenderTextarea = globalShareState.getComponents().Textarea;
const RenderDefaultButton = globalShareState.getComponents().DefaultButton;
const RenderPrimaryButton = globalShareState.getComponents().PrimaryButton;

const [Modal, modalApi] = useVbenModal({
  header: false,
  footer: false,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  fullscreenButton: false,
  closable: false,
  zIndex: 10_000,
  onOpenChange: (isOpen) => {
    if (isOpen) {
      model.feedbackMessage = '';
    }
  },
});

const handleHideModal = () => {
  emit('hide');
};

watch(
  () => props.open,
  (val) => {
    if (val) {
      modalApi?.open();
    } else {
      modalApi?.close();
    }
  },
  {
    immediate: true,
  },
);

const handleSubmit = async () => {
  submitLoading.value = true;
  try {
    await props.feedbackApi?.({
      exceptionNoList: props.exceptionNoList || [],
      feedBackContent: model.feedbackMessage,
    });
    handleHideModal();
  } catch {
    // do nothing
  } finally {
    submitLoading.value = false;
  }
};
</script>

<template>
  <Modal>
    <div class="exception-modal">
      <div class="exception-modal-body">
        <IconifyIcon
          class="anticon icon"
          icon="ant-design:close-circle-outlined"
        />
        <span class="title">{{ t('ui.fallback.exceptionTitle') }}</span>
        <div class="content">
          <span style="white-space: pre">
            NO: {{ exceptionNoList?.join(' ') }}
          </span>
          <RenderTextarea
            v-model:value="model.feedbackMessage"
            :placeholder="t('ui.formRules.required')"
            :rows="5"
            style="margin-top: 10px"
          />
        </div>
      </div>
      <div class="exception-modal-button">
        <RenderDefaultButton @click="handleHideModal">
          {{ t('common.cancel') }}
        </RenderDefaultButton>
        <RenderPrimaryButton
          :loading="submitLoading"
          style="margin-left: 5px"
          @click="handleSubmit"
        >
          {{ t('common.submit') }}
        </RenderPrimaryButton>
      </div>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.exception-modal {
  padding: 15px;

  &::after {
    content: '';
    display: block;
    clear: both;
  }

  .exception-modal-body {
    .icon {
      margin-right: 16px;
      color: red;
      font-size: 22px;
    }

    .title {
      display: inline;
      overflow: hidden;
      //color: #000000d9;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.4;
    }

    .content {
      margin-top: 8px;
      font-size: 14px;
    }
  }

  .exception-modal-button {
    margin-top: 24px;
    float: right;
  }
}
</style>
