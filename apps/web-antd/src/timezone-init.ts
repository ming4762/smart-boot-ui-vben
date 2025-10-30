import { setTimezoneHandler } from '@vben/stores';

import {
  getCurrentUserTimezoneApi,
  listTimezoneOptionsApi,
  setCurrentUserTimezoneApi,
} from '#/api';

/**
 * 初始化时区处理，通过API保存时区设置
 */
export function initTimezone() {
  setTimezoneHandler({
    getTimezone() {
      return getCurrentUserTimezoneApi();
    },
    setTimezone(timezone: string) {
      return setCurrentUserTimezoneApi(timezone);
    },
    getTimezoneOptions() {
      return listTimezoneOptionsApi();
    },
  });
}
