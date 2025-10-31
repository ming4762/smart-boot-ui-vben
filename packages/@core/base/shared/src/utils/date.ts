import type { DurationUnitType } from 'dayjs/plugin/duration';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

export const zonedDayjs = dayjs;

type FormatDate = Date | dayjs.Dayjs | number | string;

export function formatDate(time: FormatDate, format = 'YYYY-MM-DD') {
  try {
    const date = dayjs.isDayjs(time) ? time : dayjs(time);
    if (!date.isValid()) {
      throw new Error('Invalid date');
    }
    return date.tz().format(format);
  } catch (error) {
    console.error(`Error formatting date: ${error}`);
    return String(time);
  }
}

export function formatDateTime(time: FormatDate) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}

/**
 * 将对象中的属性转为时间类型
 * @param obj
 * @param fieldList
 */
export function convertToTimezone(
  obj: Record<string, any>,
  fieldList: string[],
) {
  if (fieldList.length === 0) {
    return obj;
  }
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (!value) {
      continue;
    }
    if (fieldList.includes(key)) {
      obj[key] = zonedDayjs(obj[key]);
    }
  }
  return obj;
}

type TimeKey = 'days' | 'hours' | 'milliseconds' | 'minutes' | 'seconds';

/**
 * 格式化时长
 * @param duration
 * @param format
 */
export const formatDuration = (
  duration: number,
  format: DurationUnitType = 'seconds',
): Record<TimeKey, number> => {
  let millisecond = dayjs.duration(duration, format).asMilliseconds();
  const millisecondsInSecond = 1000;
  const millisecondsInMinute = millisecondsInSecond * 60;
  const millisecondsInHour = millisecondsInMinute * 60;
  const millisecondsInDay = millisecondsInHour * 24;

  // 计算天、小时、分钟和秒
  const days = Math.floor(millisecond / millisecondsInDay);
  millisecond -= days * millisecondsInDay;

  const hours = Math.floor(millisecond / millisecondsInHour);
  millisecond -= hours * millisecondsInHour;

  const minutes = Math.floor(millisecond / millisecondsInMinute);
  millisecond -= minutes * millisecondsInMinute;

  const seconds = Math.floor(millisecond / millisecondsInSecond);
  millisecond -= seconds * millisecondsInSecond;

  return {
    days,
    hours,
    milliseconds: millisecond,
    minutes,
    seconds,
  };
};

const timeFormatList: { key: TimeKey; value: string }[] = [
  {
    key: 'days',
    value: '天',
  },
  {
    key: 'hours',
    value: '小时',
  },
  {
    key: 'minutes',
    value: '分钟',
  },
  {
    key: 'seconds',
    value: '秒',
  },
  // {
  //   key: 'milliseconds',
  //   value: '毫秒',
  // },
];

/**
 * 格式化时间为字符串
 * @param duration
 * @param format
 */
export const formatDurationStr = (
  duration: number,
  format: DurationUnitType = 'seconds',
) => {
  const formatResult = formatDuration(duration, format);
  return timeFormatList
    .map(({ key, value }) => {
      const time = formatResult[key];
      if (time === 0) {
        return null;
      }
      return `${time < 0 ? `0${time}` : time}${value}`;
    })
    .filter((item) => item !== null)
    .join('');
};
export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isDayjsObject(value: any): value is dayjs.Dayjs {
  return dayjs.isDayjs(value);
}

/**
 * 获取当前时区
 * @returns 当前时区
 */
export const getSystemTimezone = () => {
  return dayjs.tz.guess();
};

/**
 * 自定义设置的时区
 */
let currentTimezone = getSystemTimezone();

/**
 * 设置默认时区
 * @param timezone
 */
export const setCurrentTimezone = (timezone?: string) => {
  currentTimezone = timezone || getSystemTimezone();
  dayjs.tz.setDefault(currentTimezone);
};

/**
 * 获取设置的时区
 * @returns 设置的时区
 */
export const getCurrentTimezone = () => {
  return currentTimezone;
};
