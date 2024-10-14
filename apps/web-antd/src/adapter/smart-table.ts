import { computed, unref } from 'vue';

import { setupSmartTable, useSmartTable } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import { Switch, Tag } from 'ant-design-vue';

const preference = usePreferences();

setupSmartTable({
  configSmartTable: (vxeUI) => {
    vxeUI.setConfig({
      size: 'mini',
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
  },
});

export { useSmartTable };
