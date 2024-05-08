<template>
  <BasicModal @register="registerModal" title="生成签名" @ok="handleCreateSign">
    <BasicForm @register="registerForm" :size="formSizeConfig" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { nextTick } from 'vue';
  import { dateUtil } from '@/utils/dateUtil';
  import { buildUUID } from '@/utils/uuid';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { createConfirm } from '@/utils/message/SystemNotice';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { Dayjs } from 'dayjs';

  const { formSizeConfig } = useSizeSetting();

  const [registerModal, { changeOkLoading }] = useModalInner(({ id }) => {
    nextTick(() => {
      setFieldsValue({
        date: dateUtil(),
        nonce: buildUUID(),
        accessId: id,
      });
    });
  });

  const handleCreateSign = async () => {
    const model = await validate();
    try {
      changeOkLoading(true);
      const result = await defHttp.post({
        service: ApiServiceEnum.SMART_SYSTEM,
        url: 'sys/auth/accessSecret/createSign',
        data: model,
      });
      createConfirm({
        iconType: 'warning',
        okText: '复制',
        onOk() {
          copyText(result);
        },
        title: '生成签名',
        content: result,
      });
    } finally {
      changeOkLoading(false);
    }
  };

  const [registerForm, { setFieldsValue, validate }] = useForm({
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    compact: true,
    colon: true,
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
    schemas: [
      {
        label: 'id',
        field: 'accessId',
        component: 'Input',
        show: false,
      },
      {
        label: 'Date',
        field: 'date',
        component: 'DatePicker',
        componentProps: {
          showTime: true,
          style: {
            width: '100%',
          },
          onChange: (value) => {
            if (value) {
              setFieldsValue({
                dateGmt: (value as Dayjs).tz('GMT').format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT',
              });
            }
          },
        },
        required: true,
      },
      {
        label: 'GMT',
        field: 'dateGmt',
        component: 'Input',
        dynamicReadonly: true,
      },
      {
        label: 'Nonce',
        field: 'nonce',
        component: 'Input',
        required: true,
      },
      {
        label: 'Http method',
        field: 'httpMethod',
        component: 'Input',
        required: true,
        defaultValue: 'POST',
      },
      {
        label: 'Content-Type',
        field: 'contentType',
        component: 'Input',
        required: true,
        defaultValue: 'application/json',
      },
    ],
  });
</script>
