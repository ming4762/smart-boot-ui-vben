import type { Dayjs } from 'dayjs';

import generatePicker from 'ant-design-vue/lib/date-picker/generatePicker';

import { generateDayjsConfig } from '../dayjs';

const {
  DatePicker,
  WeekPicker: ZonedWeekPicker,
  MonthPicker: ZonedMonthPicker,
  YearPicker,
  TimePicker,
  QuarterPicker: ZonedQuarterPicker,
  RangePicker: ZonedRangePicker,
} = generatePicker<Dayjs>(generateDayjsConfig());

const ZonedDatePicker = Object.assign(DatePicker, {
  ZonedWeekPicker,
  ZonedMonthPicker,
  YearPicker,
  ZonedRangePicker,
  TimePicker,
  ZonedQuarterPicker,
});

export {
  ZonedDatePicker,
  ZonedMonthPicker,
  ZonedQuarterPicker,
  ZonedRangePicker,
  ZonedWeekPicker,
};
