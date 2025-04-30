<script setup lang="ts">
import { ref, unref, watch } from 'vue';

import { useSmartTable } from '#/adapter/smart-table';
import { ApiServiceEnum, requestClient } from '#/api/request';

interface Props {
  autoSelected?: boolean;
  clickCancel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autoSelected: true,
  clickCancel: false,
});
const emit = defineEmits(['currentChange']);

const currentRef = ref<any>({});

const [SmartTable, tableApi] = useSmartTable({
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'id',
  },
  toolbarConfig: {
    refresh: true,
  },
  useSearchForm: false,
  proxyConfig: {
    ajax: {
      query: (params) => {
        return requestClient.post(
          'sys/system/listAuthUser',
          {
            ...params.ajaxParameter,
            sortName: 'seq',
          },
          {
            service: ApiServiceEnum.SMART_SYSTEM,
          },
        );
      },
    },
  },
  columns: [
    {
      field: 'name',
      title: '{system.views.system.title.name}',
      minWidth: 160,
      formatter: ({ row }) => {
        return `${row.name}(${row.code})`;
      },
    },
  ],
});

/**
 * 数据加载完成事件
 */
const handleAfterLoad = () => {
  if (props.autoSelected) {
    const grid = tableApi.getGrid();
    const dataList = grid.getData();
    if (dataList.length > 0) {
      currentRef.value = dataList[0];
    }
  }
};

watch(currentRef, (value) => {
  const grid = tableApi.getGrid();
  if (value.id) {
    grid.setCurrentRow(value);
  } else {
    grid.clearCurrentRow();
  }
  emit('currentChange', value);
});

const handleCellClick = ({ row }: any) => {
  currentRef.value =
    unref(currentRef).id === row.id && props.clickCancel ? {} : row;
};
</script>

<template>
  <SmartTable
    v-bind="$attrs"
    @cell-click="handleCellClick"
    @proxy-query="handleAfterLoad"
  />
</template>

<style scoped>
.system-table {
  :deep(.vxe-body--row) {
    cursor: pointer;
  }
}
</style>
