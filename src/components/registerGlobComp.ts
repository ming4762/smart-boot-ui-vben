import type { App } from 'vue';
import { unref } from 'vue';

import { Button } from './Button';
import {
  Input,
  Layout,
  Radio,
  Tag,
  Select,
  Tooltip,
  Tree,
  Tabs,
  Switch,
  Form,
  Checkbox,
  InputNumber,
} from 'ant-design-vue';
import VXETable from 'vxe-table';
import VXEUI from 'vxe-pc-ui';

import ExcelJS from 'exceljs';
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';
import { VXETablePluginAntd } from '@/components/SmartTable/VXETablePluginAntd';

import { i18n } from '@/locales/setupI18n';

const initVxeTable = async (app: App) => {
  const locale = unref(i18n.global.locale);
  const i18nData = await import(`@/components/SmartTable/src/locale/lang/${locale}.ts`);
  // @ts-ignore
  VXETable.setI18n(locale, i18nData.default);
  // @ts-ignore
  VXETable.setLanguage(locale);

  VXETable.setConfig({
    translate(key, args) {
      if (key.startsWith('{') && key.endsWith('}')) {
        const i18nKey = key.replace('{', '').replace('}', '');
        // @ts-ignore
        return i18n.global.t(i18nKey, args);
      }
      return key;
    },
  });
  VXETable.use(VXETablePluginAntd);
  VXETable.use(VXETablePluginExportXLSX, {
    ExcelJS,
  });

  app.use(VXETable).use(VXEUI);
};

export function registerGlobComp(app: App) {
  initVxeTable(app);
  app
    .use(Input)
    .use(Button)
    .use(Layout)
    .use(Radio)
    .use(Tag)
    .use(Select)
    .use(Tooltip)
    .use(Tree)
    .use(Tabs)
    .use(Switch)
    .use(InputNumber)
    .use(Form)
    .use(Checkbox);
}
