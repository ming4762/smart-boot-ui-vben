<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Descriptions, DescriptionsItem, Tag } from 'ant-design-vue';

import { getByIdApi } from '../SystemLogComponent.api';

const detailsData = ref<Recordable<any>>({});

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
        const id = modalApi.getData();
        detailsData.value = await getByIdApi(id);
      } finally {
        modalApi.setState({ loading: false });
      }
    } else {
      detailsData.value = {};
    }
  },
});

const firstLabelStyle = {
  width: '120px',
};
</script>

<template>
  <Modal>
    <Descriptions bordered>
      <DescriptionsItem
        :label="$t('system.views.log.title.operationType')"
        :label-style="firstLabelStyle"
      >
        {{ detailsData.operationType }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.requestPath')">
        {{ detailsData.requestPath }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.statusCode')">
        <Tag
          :color="
            detailsData.statusCode >= 200 && detailsData.statusCode < 300
              ? '#2db7f5'
              : '#f50'
          "
        >
          {{ detailsData.statusCode }}
        </Tag>
      </DescriptionsItem>

      <DescriptionsItem
        :label="$t('system.views.log.title.operation')"
        :span="2"
      >
        {{ detailsData.operation }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.logSource')">
        {{ detailsData.logSource }}
      </DescriptionsItem>

      <DescriptionsItem
        :label="$t('system.views.log.title.createTime')"
        :span="2"
      >
        {{ detailsData.createTime }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.ip')">
        {{ detailsData.ip }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.method')" :span="2">
        {{ detailsData.method }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.log.title.useTime')">
        {{ detailsData.useTime }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.params')" :span="3">
        {{ detailsData.params }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.log.title.result')" :span="3">
        {{ detailsData.result }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('system.views.log.title.errorMessage')"
        :span="3"
      >
        {{ detailsData.errorMessage }}
      </DescriptionsItem>
    </Descriptions>
  </Modal>
</template>

<style scoped></style>
