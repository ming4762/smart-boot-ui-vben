<script setup lang="ts">
import type { AnyNormalFunction } from '@vben/types';

import { onMounted, ref } from 'vue';

import { Select, SelectOption } from 'ant-design-vue';

import { ApiServiceEnum, requestClient } from '#/api/request';

interface Props {
  size?: string;
  parameter?: AnyNormalFunction<void[], any>;
}

const props = defineProps<Props>();

const data = ref<any[]>([]);

const loadData = async () => {
  const result = await requestClient.post<any[]>(
    '/db/connection/list',
    {
      sortName: 'seq',
      ...props.parameter?.(),
    },
    { service: ApiServiceEnum.SMART_CODE },
  );
  data.value = result.map((item: any) => {
    return {
      key: item.id,
      value: item.connectionName,
    };
  });
};

onMounted(loadData);
</script>

<template>
  <Select v-bind="$attrs" :size="size as never">
    <SelectOption v-for="item in data" :key="item.key" :value="item.key">
      {{ item.value }}
    </SelectOption>
  </Select>
</template>

<style scoped></style>
