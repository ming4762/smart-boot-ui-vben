import type { SmartAuthType } from '@vben/types';

import { computed, h, unref } from 'vue';

import { useAccess } from '@vben/access';
import {
  globalShareState,
  setupSmartTable,
  useSmartTable,
  VbenLoading,
} from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';
import { isFunction } from '@vben/utils';

import { $ct as t } from '@smart/common/locales';
import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx';
import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd';
import ExcelJS from 'exceljs';

import { SmartTableCustomStorageDBPlugin } from './plugins/smart-table-custom-storage-plugin';

const preference = usePreferences();

function initPluginRenderAntdComponent() {
  const components = globalShareState.getComponents();
  for (const componentsKey in components) {
    const component = components[componentsKey];
    if (componentsKey.startsWith('A')) {
      VxeUIPluginRenderAntd.component({
        name: componentsKey,
        ...component,
      });
    }
  }
}

const doSetupSmartTable = () => {
  // 初始化插件渲染组件
  initPluginRenderAntdComponent();
  setupSmartTable({
    configSmartTable: (vxeUI) => {
      // 引入 antd 渲染器
      vxeUI
        .use(VxeUIPluginRenderAntd)
        // 用户配置信息存储到数据库中
        .use(SmartTableCustomStorageDBPlugin)
        .use(VxeUIPluginExportXLSX, { ExcelJS })
        .setConfig({
          size: 'small',
        });
    },
    watcherField: computed(() => {
      return {
        locale: unref(preference.locale),
        theme: unref(preference.theme),
      };
    }),
    componentHandler: (name) => globalShareState.getComponents()[name],
    i18nHandler: (key: string, args?: any) => t(key, args),
    messageHandler: {
      success: (message: string) =>
        globalShareState.getMessage().success?.(message),
      warning: (message: string) =>
        globalShareState.getMessage().warning?.(message),
      error: (message: string) =>
        globalShareState.getMessage().error?.(message),
      confirm: (options: Record<string, any>) =>
        globalShareState.getMessage().confirm?.(options),
    },
    permissionHandler: (code?: SmartAuthType) => {
      if (!code) {
        return true;
      }
      if (isFunction(code)) {
        return code();
      }
      const { hasAccessByAuth } = useAccess();
      return hasAccessByAuth(code);
    },
    defaultSlots: () => {
      return {
        loading: () => [h(VbenLoading, { spinning: true })],
      };
    },
  });
};

export { doSetupSmartTable, useSmartTable };

export type {
  SmartSearchFormSchema,
  SmartTableActionItem,
  SmartTableColumn,
  SmartTableProps,
} from '@vben/common-ui';

export {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
  SmartVxeTableAction,
} from '@vben/common-ui';
