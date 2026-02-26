import type { SmartAuthType } from '@vben/types';

import { computed, h } from 'vue';

// import { usePreferences } from '@vben/preferences';
import { isFunction } from '@vben/utils';

import { globalShareState } from '@vben-core/shared/global-state';
// import { useAccess } from '@vben/access';
import { setupSmartTable, useSmartTable } from '@vben-core/smart-table-ui';

import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx';
import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd-smart-boot';
import { Spin } from 'ant-design-vue';
import ExcelJS from 'exceljs';

import { SmartTableCustomStorageDBPlugin } from './plugins/smart-table-custom-storage-plugin';

// const preference = usePreferences();

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
      // TODO
      return {
        locale: 'zh-CN',
        theme: 'light',
      };
    }),
    componentHandler: (name) => globalShareState.getComponents()[name],
    i18nHandler: (key: string, args?: any) => $t(key, args),
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
      return true;
      // const { hasAccessByAuth } = useAccess();
      // return hasAccessByAuth(code);
    },
    defaultSlots: () => {
      return {
        loading: () => [h(Spin, { spinning: true })],
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
} from '@vben-core/smart-table-ui';

export {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
  SmartVxeTableAction,
} from '@vben-core/smart-table-ui';
