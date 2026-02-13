import type { Dayjs } from '@vben/utils';

import { DatePicker } from 'antdv-next';

import { generateZonedDayjsConfig } from '../zonedDayjs';

const generatePicker = DatePicker.generatePicker;

const ZonedDatePicker = generatePicker<Dayjs>(generateZonedDayjsConfig());

export { ZonedDatePicker };

export const ZonedRangePicker = ZonedDatePicker.RangePicker;
export const ZonedWeekPicker = ZonedDatePicker.WeekPicker;
export const ZonedMonthPicker = ZonedDatePicker.MonthPicker;
export const ZonedYearPicker = ZonedDatePicker.YearPicker;
export const ZonedQuarterPicker = ZonedDatePicker.QuarterPicker;
