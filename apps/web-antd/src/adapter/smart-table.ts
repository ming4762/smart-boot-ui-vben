import type { SmartAuthType } from '@vben/types';

import { computed, unref } from 'vue';

import { useAccess } from '@vben/access';
import {
  globalShareState,
  setupSmartTable,
  useSmartTable,
} from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd-smart-boot';

import { $t } from '#/locales';

const preference = usePreferences();

setupSmartTable({
  configSmartTable: (vxeUI) => {
    // 引入 antd 渲染器
    vxeUI
      .use(VxeUIPluginRenderAntd, {
        componentProvider: globalShareState.getComponents()[name],
      })
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
  i18nHandler: (key: string, args?: any) => $t(key, args),
  messageHandler: {
    success: (message: string) =>
      globalShareState.getMessage().success?.(message),
    warning: (message: string) =>
      globalShareState.getMessage().warning?.(message),
    error: (message: string) => globalShareState.getMessage().error?.(message),
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
});

export { useSmartTable };

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
