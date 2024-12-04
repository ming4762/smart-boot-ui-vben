<script setup lang="ts">
import { unref } from 'vue';

import { type ExtendedModalApi, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import { useClipboard } from '@vueuse/core';
import { Dayjs } from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { ApiServiceEnum, requestClient } from '#/api/request';
import { createConfirm } from '#/utils';

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
      label: 'id',
      fieldName: 'accessId',
      component: 'Input',
      dependencies: {
        triggerFields: ['accessId'],
        show: false,
      },
    },
    {
      label: 'Date',
      fieldName: 'date',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        style: {
          width: '100%',
        },
        onChange: (value: Dayjs) => {
          if (value) {
            formApi.setFieldValue(
              'dateGmt',
              `${value.tz('GMT').format('ddd, DD MMM YYYY HH:mm:ss')} GMT`,
            );
          }
        },
      },
      rules: 'required',
    },
    {
      label: 'GMT',
      fieldName: 'dateGmt',
      component: 'Input',
      disabled: true,
    },
    {
      label: 'Nonce',
      fieldName: 'nonce',
      component: 'Input',
      rules: 'required',
    },
    {
      label: 'Http method',
      fieldName: 'httpMethod',
      component: 'Input',
      rules: 'required',
      defaultValue: 'POST',
    },
    {
      label: 'Content-Type',
      fieldName: 'contentType',
      component: 'Input',
      rules: 'required',
      defaultValue: 'application/json',
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
      'sys/auth/accessSecret/createSign',
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
  title: '生成签名',
  onConfirm: () => handleCreateSign(modalApi),
});
</script>

<template>
  <Modal>
    <Form :size="getFormSize" />
  </Modal>
</template>

<style scoped></style>
