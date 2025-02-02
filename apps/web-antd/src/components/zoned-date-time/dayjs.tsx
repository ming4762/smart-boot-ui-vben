import type { GenerateConfig } from 'ant-design-vue/lib/vc-picker/generate';

import { zonedDayjs } from '@vben/utils';

import generateConfig from 'ant-design-vue/lib/vc-picker/generate/dayjs';
import dayjs from 'dayjs';

export const generateDayjsConfig = (
  timeZone?: string,
): GenerateConfig<dayjs.Dayjs> => {
  return {
    ...generateConfig,
    getNow: () => {
      if (timeZone) {
        return zonedDayjs().tz(timeZone);
      }
      return zonedDayjs().tz();
    },
    locale: {
      ...generateConfig.locale,
      format: (_, date, format) => {
        if (timeZone) {
          return date.tz(timeZone).format(format);
        }
        return date.tz().format(format);
      },
    },
  };
};
