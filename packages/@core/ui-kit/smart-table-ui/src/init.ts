import type { Component, Slots } from 'vue';

import type { SmartAuthType } from '@vben-core/typings';

import type { SetupSmartTable } from './types';
import type { SmartTableMessageHandler } from './types/SmartTableMessageType';

import { defineComponent, watch } from 'vue';

import {
  VxeButton,
  VxeIcon,
  VxeInput,
  VxeModal,
  VxeNumberInput,
  VxePager,
  VxeRadioGroup,
  VxeSelect,
  VxeTooltip,
  VxeUI,
} from 'vxe-pc-ui';
import {
  VxeColgroup,
  VxeColumn,
  VxeGrid,
  VxeTable,
  VxeToolbar,
} from 'vxe-table';

import { getI18nData } from './locales';
import { initSmartTableRender } from './renderer';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './style/index.scss';

interface SmartSetupHandler {
  defaultSlots?: () => Slots;
  getComponent: (name: string) => Component | string | undefined;
  hasPermission: (auth?: SmartAuthType) => boolean;
  messageHandler: SmartTableMessageHandler;
}

/**
 * 消息处理功能
 */
const defaultMessageHandle = () => console.warn('请设置messageHandler');

const DEFAULT_SETUP_HANDLER: SmartSetupHandler = {
  getComponent: (_: string) => undefined,
  hasPermission: (_?: SmartAuthType) => false,
  messageHandler: {
    confirm: defaultMessageHandle,
    error: defaultMessageHandle,
    success: defaultMessageHandle,
    warning: defaultMessageHandle,
  },
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
  VxeUI.component(VxeNumberInput);
  VxeUI.component(VxeModal);
  VxeUI.component(VxeRadioGroup);

  VxeUI.component(createVirtualComponent('VxeForm'));

  isInit = true;
};

/**
 * 初始化表格函数
 * @param setupOptions
 */
const setupSmartTable = (setupOptions: SetupSmartTable) => {
  const {
    componentHandler,
    configSmartTable,
    defaultSlots,
    i18nHandler,
    messageHandler,
    permissionHandler,
    watcherField,
  } = setupOptions;

  // 初始化组件
  initSmartTableComponent();
  VxeUI.setConfig({
    translate(key, args) {
      if (!i18nHandler) {
        return key;
      }
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

  if (messageHandler) {
    Object.assign(DEFAULT_SETUP_HANDLER.messageHandler, messageHandler);
  }

  if (permissionHandler) {
    DEFAULT_SETUP_HANDLER.hasPermission = permissionHandler;
  }
  if (componentHandler) {
    DEFAULT_SETUP_HANDLER.getComponent = componentHandler;
  }
  DEFAULT_SETUP_HANDLER.defaultSlots = defaultSlots;

  configSmartTable(VxeUI);

  // 初始化按钮渲染器
  initSmartTableRender();
};

export { DEFAULT_SETUP_HANDLER, setupSmartTable };
