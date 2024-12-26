<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed, ref, unref, watch } from 'vue';

import { useUserStore } from '@vben/stores';

import { Select } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { ApiServiceEnum, requestClient } from '#/api/request';

let dataLoaded = false;
const { getIsPlatformTenant } = storeToRefs(useUserStore());

const dataListRef = ref<Recordable<any>[]>([]);
const computedOptions = computed(() => {
  if (!unref(getIsPlatformTenant)) {
    return [];
  }
  return unref(dataListRef).map((item) => {
    return {
      label: item.tenantShortName || item.tenantName,
      value: item.id,
    };
  });
});

const loadTenantData = async () => {
  dataListRef.value = await requestClient.post(
    'sys/tenant/manager/listTenantNoAuth',
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  dataLoaded = true;
};

watch(
  getIsPlatformTenant,
  (value) => {
    if (value && !dataLoaded) {
      loadTenantData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Select v-bind="$attrs" :options="computedOptions" />
</template>

<style scoped></style>
