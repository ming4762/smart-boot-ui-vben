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

import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx';
import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd-smart-boot';
import ExcelJS from 'exceljs';

import { $ct as t } from '#/locales';

import { SmartTableCustomStorageDBPlugin } from './plugins/smart-table-custom-storage-plugin';

const preference = usePreferences();

const doSetupSmartTable = () => {
  setupSmartTable({
    configSmartTable: (vxeUI) => {
      // 引入 antd 渲染器
      vxeUI
        .use(VxeUIPluginRenderAntd, {
          componentProvider: (name: string) => {
            if (name.startsWith('A')) {
              return globalShareState.getComponents()[name.slice(1)];
            }
            return globalShareState.getComponents()[name];
          },
        })
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
