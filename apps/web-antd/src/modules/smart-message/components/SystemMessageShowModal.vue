<script setup lang="ts">
import { computed, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

import { markAsReadApi } from '#/modules/smart-message/api';

import { getMessagePriorityEnum } from '../SmartMessageConstants';
import { getDetailByIdApi } from '../views/SystemMessage/SmartMessageSystemListView.api';

const emit = defineEmits<{ confirm: [void] }>();

const messageDataRef = ref<any>({});

const [Modal, modalApi] = useVbenModal({
  title: t('common.button.look'),
  class: 'w-[800px] min-h-[500px]',
  onOpened: async () => {
    const { messageId } = modalApi.getData();
    try {
      modalApi.setState({ loading: true });
      messageDataRef.value = (await getDetailByIdApi(messageId)) || {};
    } finally {
      modalApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    const { id, readYn } = modalApi.getData();
    if (readYn) {
      modalApi.close();
      return;
    }
    try {
      modalApi.setState({ confirmLoading: true });
      await markAsReadApi({
        messageIdList: [id],
      });
      emit('confirm');
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  },
});

const messagePriorityEnum = getMessagePriorityEnum();
/**
 * 优先级计算属性
 */
const computedMessagePriority = computed(() => {
  const enumList = messagePriorityEnum.filter(
    (item) => item.value === unref(messageDataRef).priority,
  );
  if (enumList.length > 0) {
    return enumList[0];
  }
  return null;
});
</script>

<template>
  <Modal>
    <div>
      <div>
        <h2 class="message-title">{{ messageDataRef.title }}</h2>
        <div v-if="computedMessagePriority !== null" class="sub-title">
          <Tag :color="computedMessagePriority!.color">
            {{ computedMessagePriority!.label }}
          </Tag>
          <span class="sub-title-sender">
            {{ messageDataRef.sender?.fullName || messageDataRef.createBy }}
          </span>
          <span class="sub-title-sender">{{ messageDataRef.sendTime }}</span>
        </div>
      </div>
      <div v-html="messageDataRef.content"></div>
    </div>
  </Modal>
</template>

<style scoped>
.message-title {
  margin: 0 0 14px;
  font-size: 22px;
  line-height: 1.4;
}

.sub-title {
  margin-bottom: 22px;
  font-size: 0;
  hyphens: auto;
  line-height: 20px;
  word-wrap: break-word;
}

.sub-title-sender {
  display: inline-block;
  margin: 0 10px 10px 0;
  font-size: 15px;
  vertical-align: middle;
  -webkit-tap-highlight-color: rgb(0 0 0 / 0%);
}
</style>
