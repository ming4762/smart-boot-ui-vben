<script setup lang="ts">
import { unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { useVbenForm } from '#/adapter/form';
import { ApiServiceEnum, requestClient } from '#/api/request';
import { SmartTableSelect } from '#/components';
import TemplateSelectTable from '#/modules/smart-code/views/codeList/components/TemplateSelectTable.vue';
import { warnMessage } from '#/utils';

import CodeCreatedResultModal from './CodeCreatedResultModal.vue';

const { getFormSize } = useSizeSetting();

const listByIdApi = (ids: any[]) => {
  return requestClient.post('db/code/template/listById', ids, {
    service: ApiServiceEnum.SMART_CODE,
  });
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      size: unref(getFormSize),
    },
  },
  showDefaultActions: false,
  schema: [
    {
      label: '',
      fieldName: 'mainId',
      component: 'Input',
      dependencies: {
        triggerFields: ['mainId'],
        show: false,
      },
    },
    {
      label: t('smart.code.views.codeCreateForm.title.description'),
      fieldName: 'description',
      component: 'Input',
    },
    {
      label: t('smart.code.views.codeCreateForm.title.tableName'),
      fieldName: 'tableName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: t('smart.code.views.codeCreateForm.title.className'),
      fieldName: 'className',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('smart.code.views.codeCreateForm.title.packages'),
      fieldName: 'packages',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('smart.code.views.codeCreateForm.title.controllerBasePath'),
      fieldName: 'controllerBasePath',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('smart.code.views.codeCreateForm.title.customConfig'),
      fieldName: 'customConfig',
      component: 'Textarea',
      componentProps: {
        placeholder: t('smart.code.views.codeCreateForm.message.customConfig'),
      },
    },
    {
      label: t('smart.code.views.codeCreateForm.title.templateList'),
      fieldName: 'templateIdList',
      slot: 'form-templateIdList',
      component: 'Input',
    },
  ],
});

const [RenderCodeCreatedResultModal, codeResultModalApi] = useVbenModal({
  connectedComponent: CodeCreatedResultModal,
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  title: t('smart.code.views.codeManager.button.createCode'),
  onOpened: () => {
    const { remarks, tableName, className, id } = modalApi.getData();
    formApi.setValues({
      description: remarks,
      tableName,
      className,
      mainId: id,
      templateIdList: [],
    });
  },
  onConfirm: async () => {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const model = await formApi.getValues();
    const templateIdList = model.templateIdList;
    if (!templateIdList || templateIdList.length === 0) {
      warnMessage(t('smart.code.views.codeCreateForm.message.choseTemplate'));
      return false;
    }
    codeResultModalApi.setData(model);
    codeResultModalApi.open();
  },
});
</script>

<template>
  <Modal>
    <Form>
      <template #form-templateIdList="{ model }">
        <SmartTableSelect
          v-model:value="model.templateIdList"
          :list-api="listByIdApi"
          :table-props="{}"
          allow-clear
          fullscreen
          label-field="name"
          multiple
          title="选择模板"
          value-field="templateId"
        >
          <template #table="{ selectData, registerHandler }">
            <TemplateSelectTable
              :register-handler="registerHandler"
              :select-data="selectData"
            />
          </template>
        </SmartTableSelect>
      </template>
    </Form>
    <RenderCodeCreatedResultModal />
  </Modal>
</template>

<style scoped></style>
