import { RoleInfo, UserInfo, UserTenant } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { createPassword, getAuthCache, setAuthCache } from '@/utils/auth';
import {
  ChangePasswordParams,
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
} from '@/api/sys/model/userModel';
import {
  changePasswordApi,
  doLogout,
  loginApi,
  changeTenantApi,
  rememberLoginApi,
} from '@/api/sys/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { usePermission } from '@/hooks/web/usePermission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { h } from 'vue';
import Cookies from 'universal-cookie';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleInfo[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

const cookies = new Cookies();

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleInfo[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleInfo[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
    getUserTenant(): UserTenant | undefined {
      return this.getUserInfo.userTenant;
    },
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
      return state.roleList.some((role) => role.superAdminYn);
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleInfo[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * 切换租户
     */
    async changeTenant(tenantId: number) {
      const data = await changeTenantApi(tenantId);
      // 刷新菜单
      await this.afterLoginAction(data, false);
      const { refreshMenu } = usePermission();
      await refreshMenu();
      router.replace(data.user?.homePath || PageEnum.BASE_HOME);
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);

        return this.afterLoginAction(data, goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * remember登录
     * @param params
     */
    async rememberLogin(
      params: { goHome?: boolean; buildRoute?: boolean } = { goHome: false, buildRoute: true },
    ) {
      const data = await rememberLoginApi();
      return this.afterLoginAction(data, params.goHome, params.buildRoute);
    },
    async afterLoginAction(
      loginResult: LoginResultModel,
      goHome?: boolean,
      buildRoute?: boolean,
    ): Promise<GetUserInfoModel | null> {
      const { token, user: userInfo, permissions, roles } = loginResult;
      this.setToken(token);
      this.setRoleList(roles);
      if (!this.getToken) return null;
      // get user info
      userInfo.realName = userInfo.fullName;
      this.setUserInfo({
        ...userInfo,
      });
      if (buildRoute === false) {
        return userInfo;
      }
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        permissionStore.setPermCodeList(permissions);
        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      // if (!this.getToken) return null;
      // const userInfo = await getUserInfo();
      // const { roles = [] } = userInfo;
      // if (isArray(roles)) {
      //   const roleList = roles.map((item) => item.value) as RoleEnum[];
      //   this.setRoleList(roleList);
      // } else {
      //   userInfo.roles = [];
      //   this.setRoleList([]);
      // }
      // this.setUserInfo(userInfo);
      // return userInfo;
      return this.getUserInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setRoleList([]);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      const permissionStore = usePermissionStore();
      permissionStore.setPermCodeList([]);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
    /**
     * 修改密码
     * @param parameter 参数
     */
    changePassword({ oldPassword, newPassword, newPasswordConfirm }: ChangePasswordParams) {
      const { username } = this.getUserInfo;
      console.log(oldPassword, newPassword);
      return changePasswordApi({
        oldPassword: createPassword(username, oldPassword),
        newPassword: createPassword(username, newPassword),
        newPasswordConfirm: createPassword(username, newPasswordConfirm),
      });
    },
    /**
     * 从cookie获取并设置token
     */
    getAndSetTokenFromCookie() {
      const rememberCookie = cookies.get('remember-me');
      if (rememberCookie) {
        this.setToken(rememberCookie);
      }
    },
    hasRemember(): boolean {
      const rememberToken = cookies.get('remember-me');
      return rememberToken !== undefined && rememberToken !== null;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
