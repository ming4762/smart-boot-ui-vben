<script setup lang="ts">
import { ref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';

import SysParameterList from './components/SysParameterList.vue';
import SysParameterTenantList from './components/SysParameterTenantList.vue';

const currentRowRef = ref<any>(null);
const handleChange = (row: any) => {
  currentRowRef.value = row;
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate
      class="h-full"
      layout="topBottom"
      first-size="70%"
      draggable
      show-divider
    >
      <template #first>
        <SysParameterList @change="handleChange" class="h-full" />
      </template>
      <template #second>
        <SysParameterTenantList
          :parameter-id="currentRowRef?.id"
          class="h-full"
        />
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style lang="less" scoped></style>
