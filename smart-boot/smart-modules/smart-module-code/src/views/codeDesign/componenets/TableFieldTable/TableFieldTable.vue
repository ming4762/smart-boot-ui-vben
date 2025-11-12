<script setup lang="ts">
import { computed, unref } from 'vue';

import { useSmartTable } from '@vben/common-ui';

import { getTableFiledColumns } from '../../CodeDesignPage.config';
import {
  injectCodeDesignContext,
  injectCodeDesignHandler,
} from '../../useContext';

const { contextData } = injectCodeDesignContext();
const { registerSaveDataHandler } = injectCodeDesignHandler();

const [SmartTable] = useSmartTable({
  useSearchForm: false,
  columns: getTableFiledColumns(),
  border: true,
  align: 'center',
  stripe: true,
  rowConfig: {
    isHover: true,
  },
});

const computedTableData = computed(() => {
  return unref(contextData).tableData;
});

registerSaveDataHandler(() => {
  const { className, remarks } = unref(contextData).dbData;

  return {
    className,
    remarks,
  };
});
</script>

<template>
  <div>
    <SmartTable v-bind="$attrs" :data="computedTableData" />
  </div>
</template>

<style scoped></style>
