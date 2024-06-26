import { generateModuleMessage, genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import { deepMerge } from '@/utils';
import vxeZhCN from 'vxe-table/lib/locale/lang/zh-CN';
import smartTableZhCN from '@/components/SmartTable/src/lang/zh_CN';

const modules = import.meta.glob('./zh-CN/**/*.{json,ts,js}', { eager: true });
const modulesLocales = import.meta.glob('../../modules/**/lang/zh_CN.ts', { eager: true });
export default {
  message: {
    ...deepMerge(
      genMessage(modules as Recordable<Recordable>, 'zh-CN'),
      generateModuleMessage(modulesLocales as Recordable<Recordable>),
    ),
    ...smartTableZhCN,
    antdLocale: {
      ...antdLocale,
      DatePicker: deepMerge(
        antdLocale.DatePicker,
        genMessage(modules as Recordable<Recordable>, 'zh-CN').antdLocale.DatePicker,
      ),
    },
    ...vxeZhCN,
  },
};
