import type { Dayjs } from '@vben/utils';

import { DatePicker } from 'antdv-next';

import { generateZonedDayjsConfig } from '../zonedDayjs';

const generatePicker = DatePicker.generatePicker;

const ZonedDatePicker: ReturnType<typeof generatePicker<Dayjs>> = generatePicker<Dayjs>(generateZonedDayjsConfig());

export { ZonedDatePicker };

export const ZonedRangePicker: typeof ZonedDatePicker.RangePicker = ZonedDatePicker.RangePicker;
export const ZonedWeekPicker: typeof ZonedDatePicker.WeekPicker = ZonedDatePicker.WeekPicker;
export const ZonedMonthPicker: typeof ZonedDatePicker.MonthPicker = ZonedDatePicker.MonthPicker;
export const ZonedYearPicker: typeof ZonedDatePicker.YearPicker = ZonedDatePicker.YearPicker;
export const ZonedQuarterPicker: typeof ZonedDatePicker.QuarterPicker = ZonedDatePicker.QuarterPicker;
