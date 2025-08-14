<script setup lang="ts">
import { toRaw, toRefs, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';

import { Spin, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { SmartIconButton } from '#/components';

import { formSchemas } from '../CodeDesignPage.config';
import { useLoadDbData } from '../CodeDesignPageHook';
import { injectCodeDesignHandler } from '../useContext';
import PageAddendumTableChoseModal from './PageAddendumTableChoseModal.vue';

interface Props {
  systemId?: number | string;
  configId?: number | string;
}
const props = defineProps<Props>();
const { systemId, configId } = toRefs(props);

const { getFormSize, getTableSize, getButtonSize } = useSizeSetting();

const { registerSaveDataHandler } = injectCodeDesignHandler();

const [RenderPageAddendumTableChoseModal, addendumTableModalApi] = useVbenModal(
  {
    connectedComponent: PageAddendumTableChoseModal,
  },
);

const getDatabaseListParameter = () => {
  return {
    parameter: {
      'systemId@=': unref(systemId),
    },
  };
};

const [Form, formApi] = useVbenForm({
  schema: formSchemas(getDatabaseListParameter),
  wrapperClass: 'grid-cols-4 grid',
  showDefaultActions: false,
  commonConfig: {
    componentProps: {
      size: unref(getFormSize),
    },
  },
});

registerSaveDataHandler(async () => {
  const { valid } = await formApi.validate();
  if (!valid) {
    throw new Error('表单校验失败');
  }
  return toRaw(await formApi.getValues());
});

const { handleSyncTableData, configLoadingRef } = useLoadDbData(
  formApi,
  configId,
  systemId,
);

const handleRemoveRelateTable = (dataList: any[], index: number) => {
  dataList.splice(index, 1);
};

const handleSetAddendumTable = (tableData: any[]) => {
  formApi.setFieldValue('addendumTableList', tableData);
};
</script>

<template>
  <Spin :spinning="configLoadingRef">
    <Form>
      <template #addEditForm-RelateTable="{ model }">
        <Tag
          v-for="(table, index) in model.addendumTableList"
          :key="index"
          closable
          style="display: inline-block"
          @close="() => handleRemoveRelateTable(model.addendumTableList, index)"
        >
          {{ table.configName }}
        </Tag>
        <IconifyIcon
          :style="{ cursor: 'pointer' }"
          icon="ant-design:plus-outlined"
          @click="() => addendumTableModalApi.open()"
        />
        <RenderPageAddendumTableChoseModal
          :form-size="getFormSize"
          :select-table-list="model.relatedTableList"
          :size="getTableSize"
          @ok="handleSetAddendumTable"
        />
      </template>
      <template #addEditForm-syncTable>
        <SmartIconButton
          :size="getButtonSize as never"
          pre-icon="ant-design:sync-outlined"
          type="primary"
          @click="handleSyncTableData"
        >
          {{ t('smart.code.views.codeManager.button.syncTableData') }}
        </SmartIconButton>
      </template>
    </Form>
  </Spin>
</template>

<style scoped></style>
