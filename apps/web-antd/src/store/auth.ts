import type { ChangePasswordParams, Recordable, UserInfo } from '@vben/types';

import type { AuthApi } from '#/api';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ApiServiceEnum, DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';
import { createPassword } from '@vben/utils';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { changePasswordApi, changeTenantApi, loginApi, logoutApi } from '#/api';
import { requestClient } from '#/api/request';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);
  // 是否显示登录过去期的弹窗
  const showLoginExpired = ref(false);

  /**
   * 解决刷新路由，store持久化丢失问题
   * @param userInfo
   * @param permissions
   */
  const loginSetStore = (userInfo: UserInfo, permissions: string[]) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(permissions);
        resolve('');
      }, 1);
    });
  };

  const afterLogin = async (
    loginData: AuthApi.LoginResult,
    changeTenant = false,
    onSuccess?: (userInfo: UserInfo) => Promise<void> | void,
  ) => {
    const { permissions, roles, token, user } = loginData;

    let userInfo: null | UserInfo = null;
    // 如果成功获取到 accessToken
    if (token) {
      accessStore.setAccessToken(token);

      // 获取用户信息并存储到 accessStore 中
      // const [fetchUserInfoResult, accessCodes] = await Promise.all([
      //   fetchUserInfo(),
      //   getAccessCodesApi(),
      // ]);

      userInfo = {
        ...user,
        realName: user.fullName,
        roles,
      };
      await loginSetStore(userInfo, permissions);
      // userStore.setUserInfo(userInfo);
      // accessStore.setAccessCodes(permissions);

      if (accessStore.loginExpired) {
        accessStore.setLoginExpired(false);
      } else {
        onSuccess
          ? await onSuccess?.(userInfo)
          : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
      }

      if (userInfo?.realName) {
        notification.success({
          description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
          duration: 3,
          message: changeTenant
            ? $t('authentication.changeTenantSuccess')
            : $t('authentication.loginSuccess'),
        });
      }
    }
    return userInfo;
  };

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   * @param onSuccess
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const loginData = await loginApi(params as never);
      userInfo = await afterLogin(loginData, false, onSuccess);
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  /**
   * 切换租户
   * @param tenantId 租户ID
   */
  const changeTenant = async (tenantId: number) => {
    const data = await changeTenantApi(tenantId);
    // 重置store
    resetAllStores();
    accessStore.setLoginExpired(false);

    afterLogin(data, true, async (userInfo) => {
      await router.replace({
        path: userInfo.homePath || DEFAULT_HOME_PATH,
        query: {
          timestamp: Date.now(),
        },
      });
    });
  };

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  /**
   * 登录过期函数
   * @param show 是否显示弹窗
   * @param isConfirm 是否是确认操作
   */
  const loginExpired = (show: boolean, isConfirm: boolean) => {
    showLoginExpired.value = show;
    if (isConfirm) {
      logout();
    }
  };

  // async function fetchUserInfo() {
  //   let userInfo: null | UserInfo = null;
  //   userInfo = await getUserInfoApi();
  //   userStore.setUserInfo(userInfo);
  //   return userInfo;
  // }

  function $reset() {
    loginLoading.value = false;
  }

  /**
   * 申请临时 token
   * @param resource 申请资源
   * @param once 是否只使用一次
   */
  const applyTempToken = async (
    resource: string,
    once = true,
  ): Promise<string> => {
    return requestClient.post(
      'auth/tempToken/apply',
      { resource, once },
      {
        service: ApiServiceEnum.SMART_AUTH,
      },
    );
  };

  /**
   * 修改密码
   * @param data
   */
  const changePassword = (data: ChangePasswordParams) => {
    const userInfo = userStore.userInfo;
    if (!userInfo) {
      throw new Error('用户信息不存在');
    }
    const { username } = userInfo;
    return changePasswordApi({
      oldPassword: createPassword(username, data.oldPassword),
      newPassword: createPassword(username, data.newPassword),
      newPasswordConfirm: createPassword(username, data.newPasswordConfirm),
    });
  };

  return {
    $reset,
    authLogin,
    // fetchUserInfo,
    loginLoading,
    logout,
    applyTempToken,
    loginExpired,
    showLoginExpired,
    changeTenant,
    changePassword,
  };
});
