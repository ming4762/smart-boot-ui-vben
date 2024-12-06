<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';

import { Transfer } from 'ant-design-vue';

import { ApiServiceEnum, requestClient } from '#/api/request';

interface Props {
  templateType?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['templateChange']);

const { templateType } = toRefs(props);
// 所有模板数据
const transDataSource = ref([]);
const dataLoading = ref(false);
const targetKeysModel = ref<Array<string>>([]);
/**
 * 加载模板数据
 */
const loadData = async () => {
  dataLoading.value = true;
  targetKeysModel.value = [];
  try {
    const result = await requestClient.post(
      'db/code/template/list',
      {
        parameter: {
          'templateType@=': templateType.value,
        },
      },
      {
        service: ApiServiceEnum.SMART_CODE,
      },
    );
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

onMounted(loadData);
const handleTransChange = (targetKeys: Array<string>) => {
  emit('templateChange', targetKeys);
  targetKeysModel.value = targetKeys;
};
</script>

<template>
  <Transfer
    :data-source="transDataSource"
    :render="(item: any) => item.title"
    :target-keys="targetKeysModel"
    class="db-template-selected"
    show-search
    @change="handleTransChange"
  />
</template>

<style scoped></style>
