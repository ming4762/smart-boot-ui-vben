import type { Dayjs } from '@vben/utils';

import { zonedDayjs } from '@vben/utils';

const localeMap: { [index: string]: string } = {
  bn_BD: 'bn-bd',
  by_BY: 'be',
  en_GB: 'en-gb',
  en_US: 'en',
  fr_BE: 'fr',
  fr_CA: 'fr-ca',
  hy_AM: 'hy-am',
  kmr_IQ: 'ku',
  nl_BE: 'nl-be',
  pt_BR: 'pt-br',
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  zh_TW: 'zh-tw',
};
function parseLocale(locale: string): string {
  return localeMap[locale] || (locale.split('_')[0] as string);
}

function parseNoMatchNotice() {}

const dayjs = zonedDayjs;

export const generateZonedDayjsConfig = (timezone?: string) => {
  return {
    getNow: () => {
      const now = dayjs();
      if ('tz' in now && typeof now.tz === 'function') return now.tz();
      return now;
    },
    getFixedDate: (string: string) =>
      dayjs(string, ['YYYY-M-DD', 'YYYY-MM-DD']),
    getEndDate: (date: Dayjs) => date.endOf('month'),
    getWeekDay: (date: any) => {
      const clone = date.locale('en');
      return clone.weekday() + clone.localeData().firstDayOfWeek();
    },
    getYear: (date: Dayjs) => date.year(),
    getMonth: (date: Dayjs) => date.month(),
    getDate: (date: Dayjs) => date.date(),
    getHour: (date: Dayjs) => {
      if (timezone) {
        return date.tz(timezone).hour();
      }
      return date.tz().hour();
    },
    getMinute: (date: Dayjs) => date.minute(),
    getSecond: (date: Dayjs) => date.second(),
    getMillisecond: (date: Dayjs) => date.millisecond(),
    addYear: (date: Dayjs, diff: any) => date.add(diff, 'year'),
    addMonth: (date: Dayjs, diff: any) => date.add(diff, 'month'),
    addDate: (date: Dayjs, diff: any) => date.add(diff, 'day'),
    setYear: (date: Dayjs, year: any) => date.year(year),
    setMonth: (date: Dayjs, month: any) => date.month(month),
    setDate: (date: Dayjs, num: any) => date.date(num),
    setHour: (date: Dayjs, hour: any) => date.tz().hour(hour),
    setMinute: (date: Dayjs, minute: any) => date.minute(minute),
    setSecond: (date: Dayjs, second: any) => date.second(second),
    setMillisecond: (date: Dayjs, milliseconds: any) =>
      date.millisecond(milliseconds),
    isAfter: (date1: Dayjs, date2: Dayjs) => date1.isAfter(date2),
    isValidate: (date: Dayjs) => date.isValid(),
    locale: {
      getWeekFirstDay: (locale: string) =>
        dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
      getWeekFirstDate: (locale: string, date: Dayjs) =>
        date.locale(parseLocale(locale)).weekday(0),
      getWeek: (locale: string, date: Dayjs) =>
        date.locale(parseLocale(locale)).week(),
      getShortWeekDays: (locale: string) =>
        dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
      getShortMonths: (locale: string) =>
        dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
      format: (locale: string, date: Dayjs, format: string) => {
        if (timezone) {
          return date.tz(timezone).locale(parseLocale(locale)).format(format);
        }
        return date.tz().locale(parseLocale(locale)).format(format);
      },
      parse: (locale: string, text: string, formats: string[]) => {
        const localeStr = parseLocale(locale);
        for (const format of formats) {
          const formatText = text;
          if (format.includes('wo') || format.includes('Wo')) {
            const year = formatText.split('-')[0];
            const weekStr = formatText.split('-')[1];
            const firstWeek = dayjs(year, 'YYYY')
              .startOf('year')
              .locale(localeStr);
            for (let j = 0; j <= 52; j += 1) {
              const nextWeek = firstWeek.add(j, 'week');
              if (nextWeek.format('Wo') === weekStr) return nextWeek;
            }
            parseNoMatchNotice();
            return null;
          }
          const date = dayjs(formatText, format, true).locale(localeStr);
          if (date.isValid()) return date;
        }
        if (text) parseNoMatchNotice();
        return null;
      },
    },
  };
};
