import type { SetupSmartTable } from './types';

import type { Component } from 'vue';
import { defineComponent, watch } from 'vue';

import {
  VxeColgroup,
  VxeColumn,
  VxeGrid,
  VxeTable,
  VxeToolbar,
  VxeUI,
} from 'vxe-table';

import { getI18nData } from './locales';

import 'vxe-table/styles/cssvar.scss';

const COMPONENT_MAP: Record<string, Component> = {};

// 是否加载过
let isInit = false;

const createVirtualComponent = (name = '') => {
  return defineComponent({
    name,
  });
};

/**
 * 初始化组件
 */
const initSmartTableComponent = () => {
  if (isInit) {
    return;
  }
  VxeUI.component(VxeTable);
  VxeUI.component(VxeColumn);
  VxeUI.component(VxeColgroup);
  VxeUI.component(VxeGrid);
  VxeUI.component(VxeToolbar);

  VxeUI.component(createVirtualComponent('VxeForm'));

  isInit = true;
};

/**
 * 初始化表格函数
 * @param setupOptions
 */
const setupSmartTable = (setupOptions: SetupSmartTable) => {
  const { components, configSmartTable, watcherField } = setupOptions;

  // 初始化组件
  initSmartTableComponent();

  watch(
    watcherField,
    (value) => {
      VxeUI.setTheme(value.theme === 'dark' ? 'dark' : 'light');
      VxeUI.setI18n(value.locale, getI18nData(value.locale));
      VxeUI.setLanguage(value.locale);
    },
    { immediate: true },
  );

  if (components) {
    for (const componentName of Object.keys(components)) {
      COMPONENT_MAP[componentName] = components[componentName] as Component;
    }
  }

  configSmartTable(VxeUI);
};

export { COMPONENT_MAP, setupSmartTable };
