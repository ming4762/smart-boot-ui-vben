<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';

import { ref, unref } from 'vue';

import { Language, SmartCodeEditor, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { TabPane, Tabs } from 'ant-design-vue';

import { extensionLanguageMap } from '#/constants/Constants';

const dataRef = ref<Array<any>>([]);

const loadData = async (modalApi: ExtendedModalApi) => {
  const data = modalApi.getData();
  modalApi.setState({ loading: true });
  try {
    dataRef.value = await requestClient.post('db/code/main/createCode', data, {
      service: ApiServiceEnum.SMART_CODE,
    });
  } finally {
    modalApi.setState({ loading: false });
  }
};

const [Modal, modalApi] = useVbenModal({
  title: '生成代码',
  fullscreen: true,
  confirmText: '下载全部',
  class: 'smart--code-codeCreateResult',
  onOpened: () => loadData(modalApi),
  onConfirm: () => {
    unref(dataRef).forEach((item) => {
      const filename = `${item.filename}.${extensionLanguageMap[item.language]}`;
      downloadFileFromBlobPart({
        fileName: filename,
        source: item.code,
      });
    });
  },
});
</script>

<template>
  <Modal>
    <Tabs class="h-full">
      <TabPane
        v-for="item in dataRef"
        :key="item.templateId"
        :tab="item.templateName"
      >
        <SmartCodeEditor
          :language="Language.JAVA"
          :value="item.code"
          disabled
        />
      </TabPane>
    </Tabs>
  </Modal>
</template>

<style scoped></style>
