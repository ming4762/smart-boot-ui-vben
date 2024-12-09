<script setup lang="ts">
import { useSmartTable } from '#/adapter/smart-table';

import { getTableFiledColumns } from '../../CodeDesignPage.config';
import { injectCodeDesignContext } from '../../useContext';

const { contextData } = injectCodeDesignContext();

const [SmartTable] = useSmartTable({
  columns: getTableFiledColumns(),
  border: true,
  align: 'center',
  stripe: true,
  rowConfig: {
    isHover: true,
  },
});
</script>

<template>
  <div>
    <SmartTable v-bind="$attrs" :data="contextData.tableData" />
  </div>
</template>

<style scoped></style>
