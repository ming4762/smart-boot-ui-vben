import type { BasicUserInfo, UserRole, UserTenant } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: UserRole[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: UserRole[]) {
      this.userRoles = roles;
    },
  },
  getters: {
    /**
     * 是否是平台租户
     */
    getIsPlatformTenant(): boolean {
      return this.getUserTenant?.platformYn || false;
    },
    /**
     * 是否是超级管理员用户
     * @param state
     */
    getIsSuperAdmin(state): boolean {
      return state.userRoles.some((role) => role.superAdminYn);
    },
    getUserTenant(): undefined | UserTenant {
      return this.userInfo?.userTenant;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
