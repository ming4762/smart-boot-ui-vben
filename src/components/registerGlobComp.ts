import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout, Radio, Tag } from 'ant-design-vue';
import VXETable from 'vxe-table';

import { i18n } from '@/locales/setupI18n';

export function registerGlobComp(app: App) {
  VXETable.setup({
    // @ts-ignore
    i18n: (key, args) => {
      // @ts-ignore
      return i18n.global.t(key, args);
    },
    translate(key: string, args?: any): string {
      if (key.startsWith('{') && key.endsWith('}')) {
        const i18nKey = key.replace('{', '').replace('}', '');
        // @ts-ignore
        return i18n.global.t(i18nKey, args);
      }
      return key;
    },
  });
  app.use(Input).use(Button).use(Layout).use(Radio).use(Tag).use(VXETable);
}
