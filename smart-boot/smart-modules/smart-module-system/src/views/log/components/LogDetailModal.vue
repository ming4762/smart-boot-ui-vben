<script setup lang="ts">
import type { DescriptionsItemType } from 'antdv-next';

import type { Recordable } from '@vben/types';

import { computed, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Descriptions, Tag } from 'antdv-next';

import { getByIdApi } from '../SystemLogComponent.api';

const detailsDataRef = ref<Recordable<any>>({});

const [Modal, modalApi] = useVbenModal({
  title: $t('common.title.details'),
  class: 'w-[1000px]',
  showCancelButton: false,
  confirmText: $t('common.button.close'),
  onConfirm: () => modalApi.close(),
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      try {
        modalApi.setState({ loading: true });
        const { id } = modalApi.getData();
        detailsDataRef.value = await getByIdApi(id);
      } finally {
        modalApi.setState({ loading: false });
      }
    } else {
      detailsDataRef.value = {};
    }
  },
});

const computedItems = computed<DescriptionsItemType[]>(() => {
  const detailsData = unref(detailsDataRef);
  return [
    {
      label: $t('system.views.log.title.operationType'),
      content: detailsData.operationType,
    },
    {
      label: $t('system.views.log.title.requestPath'),
      content: detailsData.requestPath,
    },
    {
      label: $t('system.views.log.title.statusCode'),
      content: detailsData.statusCode,
    },
    {
      label: $t('system.views.log.title.operation'),
      content: detailsData.operation,
      span: 2,
    },
    {
      label: $t('system.views.log.title.logSource'),
      content: detailsData.logSource,
    },
    {
      label: $t('system.views.log.title.createTime'),
      content: detailsData.createTime,
      span: 2,
    },
    {
      label: $t('system.views.log.title.ip'),
      content: detailsData.ip,
    },
    {
      label: $t('system.views.log.title.method'),
      content: detailsData.method,
      span: 2,
    },
    {
      label: $t('system.views.log.title.useTime'),
      content: detailsData.useTime,
    },
    {
      label: $t('system.views.log.title.params'),
      content: detailsData.params,
      span: 3,
    },
    {
      label: $t('system.views.log.title.result'),
      content: detailsData.result,
      span: 3,
    },
    {
      label: $t('system.views.log.title.errorMessage'),
      content: detailsData.errorMessage,
      span: 3,
    },
  ];
});
</script>

<template>
  <Modal>
    <Descriptions
      :items="computedItems"
      :column="3"
      bordered
      class="log-detail-desc"
    >
      <template #contentRender="{ index, item }">
        <template v-if="index === 2">
          <Tag
            variant="solid"
            :color="
              (item.content as number) >= 200 && (item.content as number) < 300
                ? '#2db7f5'
                : '#f50'
            "
          >
            {{ item.content }}
          </Tag>
        </template>
      </template>
    </Descriptions>
  </Modal>
</template>

<style scoped lang="less">
.log-detail-desc {
  :deep(.ant-descriptions-item-label) {
    width: 120px;
  }
}
</style>
