<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';
import type { HttpResponse } from '@vben/request';

import { ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t, $t as t } from '@vben/locales';

import { useAuthStore } from '@smart/common/store';
import { errorMessage } from '@smart/common/utils';
import { Transfer } from 'antdv-next';

import { getCreateDicUrl, listTemplate } from '../DatabaseListView.api';

interface Props {
  templateType?: string;
}

const props = defineProps<Props>();

const { applyTempToken } = useAuthStore();

const currentRow = ref<any>(null);
const transDataSource = ref([]);
const targetKeysModel = ref<Array<string>>([]);
const dataLoading = ref(false);

const loadData = async () => {
  dataLoading.value = true;
  targetKeysModel.value = [];
  try {
    const result = await listTemplate(props.templateType);
    transDataSource.value = result.map((item: any) => {
      return {
        key: `${item.templateId}`,
        title: item.name,
      };
    });
  } finally {
    dataLoading.value = false;
  }
};

const handleCreate = async (modalApi: ExtendedModalApi) => {
  const selectTemplateIdList = unref(targetKeysModel);
  if (selectTemplateIdList.length === 0) {
    errorMessage(t('generator.views.database.validate.template'));
    return false;
  }
  try {
    const tempToken = await applyTempToken('db:connection:createDic', false);
    selectTemplateIdList.forEach((templateId) => {
      const url = getCreateDicUrl({
        row: unref(currentRow),
        templateId,
        tempToken,
      });
      window.open(url);
    });
    modalApi.close();
  } catch (error: any) {
    errorMessage(error as HttpResponse);
  }
};

const [Modal, modalApi] = useVbenModal({
  class: 'w-[600px]',
  title: $t('smart.code.views.database.common.chooseTemplate'),
  onOpenChange: (open) => {
    if (open) {
      const data = modalApi.getData();
      currentRow.value = data;
      loadData();
    } else {
      targetKeysModel.value = [];
    }
  },
  onConfirm: () => handleCreate(modalApi),
});

const handleTransChange = (targetKeys: Array<string>) => {
  targetKeysModel.value = targetKeys;
};
</script>

<template>
  <Modal v-bind="$attrs">
    <Transfer
      :data-source="transDataSource"
      :render="(item: any) => item.title"
      :target-keys="targetKeysModel"
      class="db-template-selected"
      show-search
      @change="handleTransChange"
    />
  </Modal>
</template>

<style scoped>
.db-template-selected {
  :deep(.ant-transfer-list) {
    flex: none;
    width: 46%;
    height: 450px;
  }
}
</style>
