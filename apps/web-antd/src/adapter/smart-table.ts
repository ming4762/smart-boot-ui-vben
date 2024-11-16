import type { VxeUIExport } from 'vxe-table';

import { computed, unref } from 'vue';

import { setupSmartTable, useSmartTable } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import { Button, Switch, Tag } from 'ant-design-vue';

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
  },
  i18nHandler: (key: string, args?: any) => $t(key, args),
});

export { useSmartTable };
