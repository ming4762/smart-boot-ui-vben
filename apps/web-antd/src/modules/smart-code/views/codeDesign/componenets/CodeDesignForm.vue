<script setup lang="ts">
import { unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { SmartIconButton } from '#/components';

import { formSchemas } from '../CodeDesignPage.config';
import { useLoadDbData } from '../CodeDesignPageHook';
import DatabaseSelect from './DatabaseSelect/DatabaseSelect.vue';
import PageAddendumTableChoseModal from './PageAddendumTableChoseModal.vue';

interface Props {
  systemId?: number;
}

const props = defineProps<Props>();

const { getFormSize, getTableSize, getButtonSize } = useSizeSetting();

const [RenderPageAddendumTableChoseModal, addendumTableModalApi] = useVbenModal(
  {
    connectedComponent: PageAddendumTableChoseModal,
  },
);

const [Form, formApi] = useVbenForm({
  schema: formSchemas(),
  wrapperClass: 'grid-cols-4 grid',
  showDefaultActions: false,
  commonConfig: {
    componentProps: {
      size: unref(getFormSize),
    },
  },
});

const { handleSyncTableData } = useLoadDbData(formApi);

const getDatabaseListParameter = () => {
  return {
    parameter: {
      'systemId@=': props.systemId,
    },
  };
};

const handleRemoveRelateTable = (dataList: any[], index: number) => {
  dataList.splice(index, 1);
};

const handleSetAddendumTable = (tableData: any[]) => {
  formApi.setFieldValue('addendumTableList', tableData);
};
</script>

<template>
  <Form>
    <template #addEditForm-connectionId="{ model, size }">
      <DatabaseSelect
        v-model:value="model.connectionId"
        :parameter="getDatabaseListParameter"
        :size="size"
      />
    </template>
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
</template>

<style scoped></style>
