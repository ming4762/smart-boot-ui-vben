<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';

import { nextTick, unref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { createConfirm } from '@smart/common/utils';
import { useClipboard } from '@vueuse/core';

const { copy } = useClipboard({ legacy: true });

const { getFormSize } = useSizeSetting();

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    componentProps: {
      size: unref(getFormSize),
    },
  },
  schema: [
    {
      label: 'accessId',
      fieldName: 'accessId',
      component: 'Input',
      dependencies: {
        triggerFields: ['accessId'],
        show: false,
      },
    },
    {
      label: 'tokenPrefix',
      fieldName: 'tokenPrefix',
      component: 'Input',
      rules: 'required',
    },
    {
      label: 'nonce',
      fieldName: 'nonce',
      component: 'Input',
      rules: 'required',
    },
    {
      label: 'contentType',
      fieldName: 'contentType',
      component: 'Input',
    },
    {
      label: 'queryParameter',
      fieldName: 'queryParameter',
      component: 'Textarea',
    },
    {
      label: 'jsonParameter',
      fieldName: 'jsonParameter',
      component: 'Textarea',
      rules: 'required',
    },
  ],
});

const handleCreateSign = async (modalApi: ExtendedModalApi) => {
  const { valid } = await formApi.validate();
  if (!valid) {
    throw new Error('表单校验失败');
  }
  const model = await formApi.getValues();
  try {
    modalApi.setState({ confirmLoading: true });

    const result = await requestClient.post(
      'sys/auth/accessSecret/testAccessSecret',
      model,
      {
        service: ApiServiceEnum.SMART_SYSTEM,
      },
    );
    createConfirm({
      iconType: 'warning',
      okText: '复制',
      onOk() {
        copy(result);
      },
      title: '生成签名',
      content: result,
    });
  } finally {
    modalApi.setState({ confirmLoading: false });
  }
};

const [Modal, modalApi] = useVbenModal({
  title: '测试签名',
  onConfirm: () => handleCreateSign(modalApi),
  onOpened: () => {
    nextTick(() => {
      formApi.setValues({
        accessId: modalApi.getData().accessId,
      });
    });
  },
});
</script>

<template>
  <Modal>
    <Form :size="getFormSize" />
  </Modal>
</template>

<style scoped></style>
