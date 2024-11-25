<script setup lang="ts">
import type { SmartTableSize } from '../types';
import type { SmartTableToolbarSizeSetting } from '../types/SmartTableToolbarConfigType';

import { computed, onMounted, unref } from 'vue';

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
const getMenuComponent = () => getComponent('Menu');
const getMenuItemComponent = () =>
  (getMenuComponent() as any | undefined)?.Item;

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

const handleChangeSize = (e: any) => {
  const { setSmartTableProps } = tableContext.tableInnerAction;
  setSmartTableProps({
    size: e.key,
  });
  setTableSize(e.key);
};
</script>

<template>
  <component :is="getDropdownComponent()">
    <VxeButton
      :title="getI18n('smartTable.toolbar.sizeSetting')"
      v-bind="config.buttonProps"
      circle
    >
      <template #icon>
        <ButtonIcon />
      </template>
    </VxeButton>
    <template #overlay>
      <component
        :is="getMenuComponent()"
        :selected-keys="computedSize"
        @click="handleChangeSize"
      >
        <component :is="getMenuItemComponent()" key="middle">大</component>
        <component :is="getMenuItemComponent()" key="small">中等</component>
        <component :is="getMenuItemComponent()" key="mini">紧凑</component>
      </component>
    </template>
  </component>
</template>

<style scoped></style>
