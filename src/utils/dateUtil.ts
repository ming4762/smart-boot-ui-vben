/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import duration, { DurationUnitType } from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;

/**
 * 格式化时长
 * @param duration
 * @param format
 */
export const formatDuration = (duration: number, format: DurationUnitType = 'seconds') => {
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
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: parseInt(millisecond),
  };
};

const timeFormatList = [
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
export const formatDurationStr = (duration: number, format: DurationUnitType = 'seconds') => {
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
