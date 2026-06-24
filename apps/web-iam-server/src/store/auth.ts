import type { Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'antdv-next';
import { defineStore } from 'pinia';

import { ssoLoginApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);
  const showLoginExpired = ref(false);

  async function authLogin(params: Recordable<any>) {
    try {
      loginLoading.value = true;
      const loginData = await ssoLoginApi(params as never);

      if (loginData?.redirectUrl) {
        window.location.href = loginData.redirectUrl;
        return;
      }

      const { token, user, permissions, roles } = loginData;
      if (token) {
        accessStore.setAccessToken(token);
        userStore.setUserInfo({ ...user, realName: user?.fullName, roles });
        accessStore.setAccessCodes(permissions);

        notification.success({
          title: `${$t('authentication.loginSuccessDesc')}:${user?.fullName}`,
          duration: 3,
        });

        await router.push(preferences.app.defaultHomePath);
      }
    } finally {
      loginLoading.value = false;
    }
  }

  async function logout(redirect: boolean = true) {
    resetAllStores();
    accessStore.setLoginExpired(false);

    await router.replace({
      path: LOGIN_PATH,
      query: redirect ? { redirect: router.currentRoute.value.fullPath } : {},
    });
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    loginLoading,
    logout,
    showLoginExpired,
  };
});
