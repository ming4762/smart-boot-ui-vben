import { computed } from 'vue';

import {
  globalShareState,
  setupSmartTable,
  useSmartTable,
} from '@vben/common-ui';

import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd-smart-boot';

const doSetupSmartTable = () => {
  setupSmartTable({
    componentHandler: (name) => globalShareState.getComponents()[name],
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
        // .use(SmartTableCustomStorageDBPlugin)
        .setConfig({
          size: 'small',
        });
    },
    // i18nHandler: (key: string, args?: any) => t(key, args),
    messageHandler: {
      confirm: (options: Record<string, any>) =>
        globalShareState.getMessage().confirm?.(options),
      error: (message: string) =>
        globalShareState.getMessage().error?.(message),
      success: (message: string) =>
        globalShareState.getMessage().success?.(message),
      warning: (message: string) =>
        globalShareState.getMessage().warning?.(message),
    },
    // permissionHandler: (code?: SmartAuthType) => {
    //   if (!code) {
    //     return true;
    //   }
    //   const { hasAccessByAuth } = useAccess();
    //   return hasAccessByAuth(code);
    // },
    watcherField: computed(() => {
      return {
        locale: 'zh-CN',
        theme: '',
      };
    }),
  });
};

doSetupSmartTable();
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
