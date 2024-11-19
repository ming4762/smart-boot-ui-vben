import type { VxeUIExport } from 'vxe-table';

import { computed, unref } from 'vue';

import { useAccess } from '@vben/access';
import { setupSmartTable, useSmartTable } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import { isString } from '@vue/shared';
import {
  message as AntMessage,
  Button,
  Divider,
  Modal,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import { $t } from '#/locales';

const preference = usePreferences();

setupSmartTable({
  configSmartTable: (vxeUI: VxeUIExport) => {
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
  },
  i18nHandler: (key: string, args?: any) => $t(key, args),
  messageHandler: {
    success: (message: string) => AntMessage.success(message),
    warning: (message: string) => AntMessage.warning(message),
    error: (message: string) => AntMessage.error(message),
    confirm: (options: Record<string, any>) => Modal.confirm(options),
  },
  hasPermission: (code: string | string[]) => {
    if (!code) {
      return true;
    }
    const codes = isString(code) ? [code] : code;
    const { hasAccessByCodes } = useAccess();
    return hasAccessByCodes(codes);
  },
});

export { useSmartTable };
