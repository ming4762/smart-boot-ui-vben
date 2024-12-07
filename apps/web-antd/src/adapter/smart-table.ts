import type { SmartAuthType } from '@vben/types';

import { computed, unref } from 'vue';

import { useAccess } from '@vben/access';
import { setupSmartTable, useSmartTable } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import {
  message as AntMessage,
  Button,
  Divider,
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

setupSmartTable({
  configSmartTable: (vxeUI) => {
    vxeUI.setConfig({
      size: 'small',
    });
  },
  watcherField: computed(() => {
    return {
      locale: unref(preference.locale),
      theme: unref(preference.theme),
    };
  }),
  components: {
    Tag,
    Switch,
    Button,
    Tooltip,
    Popconfirm,
    Divider,
    Menu,
    Dropdown: SmartDropdown,
    Select,
  },
  i18nHandler: (key: string, args?: any) => $t(key, args),
  messageHandler: {
    success: (message: string) => AntMessage.success(message),
    warning: (message: string) => AntMessage.warning(message),
    error: (message: string) => AntMessage.error(message),
    confirm: (options: Record<string, any>) => Modal.confirm(options),
  },
  hasPermission: (code?: SmartAuthType) => {
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
