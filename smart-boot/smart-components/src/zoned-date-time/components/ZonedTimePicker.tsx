import type { Dayjs } from 'dayjs';

import createTimePicker from 'ant-design-vue/lib/time-picker/time-picker';

import { generateDayjsConfig } from '../dayjs';

const { TimePicker: ZonedTimePicker, TimeRangePicker: ZonedTimeRangePicker } =
  createTimePicker<Dayjs>(generateDayjsConfig());

export { ZonedTimePicker, ZonedTimeRangePicker };
