import type { SmartAuthType } from '@vben/types';

import { type Component, computed, unref } from 'vue';

import { useAccess } from '@vben/access';
import { setupSmartTable, useSmartTable } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd-smart-boot';
import {
  message as AntMessage,
  Button,
  Divider,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import { SmartDropdown } from '#/components';
import { $t } from '#/locales';

const preference = usePreferences();

/**
 * 表格注入组件
 */
const TABLE_COMPONENT: Record<string, Component> = {
  Tag,
  Switch,
  Button,
  Tooltip,
  Popconfirm,
  Divider,
  Menu,
  Dropdown: SmartDropdown,
  Select,
};

/**
 * 编辑表格组件
 */
const TABLE_EDIT_COMPONENT: Record<string, Component> = {
  AInput: Input,
  ASelect: Select,
  ASwitch: Switch,
};
const editComponentProvider = (name: string) => {
  return TABLE_EDIT_COMPONENT[name];
};

setupSmartTable({
  configSmartTable: (vxeUI) => {
    // 引入 antd 渲染器
    vxeUI
      .use(VxeUIPluginRenderAntd, { componentProvider: editComponentProvider })
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
  componentHandler: (name) => TABLE_COMPONENT[name],
  i18nHandler: (key: string, args?: any) => $t(key, args),
  messageHandler: {
    success: (message: string) => AntMessage.success(message),
    warning: (message: string) => AntMessage.warning(message),
    error: (message: string) => AntMessage.error(message),
    confirm: (options: Record<string, any>) => Modal.confirm(options),
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
