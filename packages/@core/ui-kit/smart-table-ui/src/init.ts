import type { SetupSmartTable } from './types';
import type { SmartTableMessageHandler } from './types/SmartTableMessageType';

import type { Component } from 'vue';
import { defineComponent, watch } from 'vue';

import {
  VxeButton,
  VxeIcon,
  VxeInput,
  VxePager,
  VxeSelect,
  VxeTooltip,
} from 'vxe-pc-ui';
import {
  VxeColgroup,
  VxeColumn,
  VxeGrid,
  VxeTable,
  VxeToolbar,
  VxeUI,
} from 'vxe-table';

import { getI18nData } from './locales';
import { initButtonRenderer } from './renderer/VxeTableButtonRenderer';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';

const COMPONENT_MAP: Record<string, Component> = {};

/**
 * 消息处理功能
 */
const defaultMessageHandle = () => console.warn('请设置messageHandler');
const MESSAGE_HANDLER: SmartTableMessageHandler = {
  confirm: defaultMessageHandle,
  error: defaultMessageHandle,
  success: defaultMessageHandle,
  warning: defaultMessageHandle,
};

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

  VxeUI.component(VxePager);
  VxeUI.component(VxeSelect);
  VxeUI.component(VxeIcon);
  VxeUI.component(VxeTooltip);
  VxeUI.component(VxeButton);
  VxeUI.component(VxeInput);

  VxeUI.component(createVirtualComponent('VxeForm'));

  isInit = true;
};

/**
 * 初始化表格函数
 * @param setupOptions
 */
const setupSmartTable = (setupOptions: SetupSmartTable) => {
  const {
    components,
    configSmartTable,
    i18nHandler,
    messageHandler,
    watcherField,
  } = setupOptions;

  // 初始化组件
  initSmartTableComponent();
  VxeUI.setConfig({
    translate(key, args) {
      if (key.startsWith('{') && key.endsWith('}')) {
        const i18nKey = key.replace('{', '').replace('}', '');
        return i18nHandler(i18nKey, args);
      }
      return key;
    },
  });

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

  if (messageHandler) {
    Object.assign(MESSAGE_HANDLER, messageHandler);
  }

  configSmartTable(VxeUI);

  // 初始化按钮渲染器
  initButtonRenderer();
};

export { COMPONENT_MAP, MESSAGE_HANDLER, setupSmartTable };
