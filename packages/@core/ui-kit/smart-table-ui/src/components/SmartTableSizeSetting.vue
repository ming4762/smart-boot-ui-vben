<script setup lang="ts">
import type { SmartTableSize } from '../types';
import type { SmartTableToolbarSizeSetting } from '../types/SmartTableToolbarConfigType';

import { computed, onMounted, reactive, unref } from 'vue';

import { createIconifyIcon } from '@vben-core/icons';

import { VxeButton } from 'vxe-pc-ui';
import { getI18n } from 'vxe-table';

import { injectSmartTableContext } from '../hooks/useSmartTableContext';
import { getComponent } from '../utils';

interface Props {
  config?: SmartTableToolbarSizeSetting;
}

withDefaults(defineProps<Props>(), {
  config: () => ({}),
});

const SMART_TABLE_SIZE_SETTING = 'SMART_TABLE_SIZE_SETTING';

const ButtonIcon = createIconifyIcon('ant-design:column-height-outlined');

const tableContext = injectSmartTableContext();

const getDropdownComponent = () => getComponent('Dropdown');

const computedSize = computed(() => {
  return [unref(tableContext.getBindValues).size];
});

const setTableSize = (size: SmartTableSize) => {
  const { getGrid } = tableContext;
  const tableId = getGrid()?.id;
  if (!tableId) {
    return;
  }
  // todo:统一缓存
  const allConfig: any =
    JSON.parse(localStorage.getItem(SMART_TABLE_SIZE_SETTING) || '{}') || {};
  allConfig[tableId as string] = size;
  localStorage.setItem(SMART_TABLE_SIZE_SETTING, JSON.stringify(allConfig));
};

const getTableSize = (tableId: string) => {
  return JSON.parse(localStorage.getItem(SMART_TABLE_SIZE_SETTING) || '{}')[
    tableId
  ];
};

onMounted(() => {
  const {
    getGrid,
    tableInnerAction: { setSmartTableProps },
  } = tableContext;
  const gridInstance = getGrid();
  const tableId = gridInstance?.id;
  if (!tableId) {
    return;
  }
  if (gridInstance?.customConfig?.storage !== true) {
    return;
  }
  const size = getTableSize(tableId as string);
  if (size) {
    setSmartTableProps({
      size,
    });
  }
});

const handleChangeSize = ({ key }: any) => {
  const { setSmartTableProps } = tableContext.tableInnerAction;
  setSmartTableProps({
    size: key,
  });
  setTableSize(key);
};

const menuList = reactive([
  {
    key: 'medium',
    label: getI18n('smartTable.title.sizeMiddle'),
  },
  {
    key: 'small',
    label: getI18n('smartTable.title.sizeSmall'),
  },
  {
    key: 'mini',
    label: getI18n('smartTable.title.sizeMini'),
  },
  {
    key: 'tiny',
    label: getI18n('smartTable.title.sizeTiny'),
  },
]);

const computedMenu = computed(() => {
  return {
    items: menuList,
    selectedKeys: unref(computedSize),
  };
});
</script>

<template>
  <component
    :is="getDropdownComponent()"
    :menu="computedMenu"
    :trigger="['hover']"
    @menu-click="handleChangeSize"
  >
    <VxeButton
      :title="getI18n('smartTable.toolbar.sizeSetting')"
      v-bind="config.buttonProps"
      circle
    >
      <template #icon>
        <ButtonIcon />
      </template>
    </VxeButton>
  </component>
</template>

<style scoped></style>
