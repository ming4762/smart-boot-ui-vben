import type { TimeZoneOption } from '@vben/types';

import { preferences } from '@vben/preferences';
import { useTabbarStore } from '@vben/stores';
import { setDefaultTimezone } from '@vben/utils';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface UserProfileState {
  timeZone: string;
  timeZoneOptions: TimeZoneOption[];
}

/**
 * @zh_CN 系统信息相关
 */
const useUserProfileStore = defineStore('core-user-profile', {
  actions: {
    setTimeZone(timeZone: string) {
      this.timeZone = timeZone;
      setDefaultTimezone(timeZone);
      const { clearCacheTab } = useTabbarStore();
      clearCacheTab();
      // TODO: 保存到后台
    },
    initTimeZone() {
      setDefaultTimezone(this.timeZone);
    },
  },
  persist: {
    pick: ['timeZone'],
  },
  state: (): UserProfileState => {
    // TODO: 从后台获取
    const { defaultTimeZone, options } = preferences.app.timeZone;
    return {
      timeZone: defaultTimeZone,
      timeZoneOptions: options,
    };
  },
});

export { useUserProfileStore };

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserProfileStore, hot));
}
