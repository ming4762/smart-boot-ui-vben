import { ApiServiceEnum, requestClient } from '#/api/request';

enum Api {
  getCurrentUserTimezone = '/sys/timezone/getCurrentUserTimezone',
  listTimezoneOptions = '/sys/timezone/listTimezoneOptions',
  setCurrentUserTimezone = '/sys/timezone/setCurrentUserTimezone',
}

/**
 * 获取可选时区列表
 */
export const listTimezoneOptionsApi = () => {
  return requestClient.post<
    {
      label: string;
      value: string;
    }[]
  >(
    Api.listTimezoneOptions,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 获取当前用户时区
 */
export const getCurrentUserTimezoneApi = () => {
  return requestClient.post<string>(
    Api.getCurrentUserTimezone,
    {},
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};

/**
 * 设置当前用户时区
 * @param timezone 时区字符串，例如："Asia/Shanghai"
 */
export const setCurrentUserTimezoneApi = (timezone: string) => {
  return requestClient.post(
    Api.setCurrentUserTimezone,
    {
      timezone,
    },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
};
