<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, provide, ref, watch } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText, CircleHelp, MdiGithub } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { listCurrentUserTenantApi, listDictItemByCodeApi } from '#/api';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';
import { createConfirm } from '#/utils';
import LoginForm from '#/views/_core/authentication/login.vue';

const notifications = ref<NotificationItem[]>([
  {
    avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
    date: '3小时前',
    isRead: true,
    message: '描述信息描述信息描述信息',
    title: '收到了 14 份新周报',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '刚刚',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '朱偏右 回复了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '2024-01-01',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '曲丽丽 评论了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '1天前',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '代办提醒',
  },
]);

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

const menus = computed(() => {
  const menus: any[] = [];
  if (import.meta.env.DEV) {
    menus.push(
      {
        handler: () => {
          openWindow(VBEN_DOC_URL, {
            target: '_blank',
          });
        },
        icon: BookOpenText,
        text: $t('ui.widgets.document'),
      },
      {
        handler: () => {
          openWindow(VBEN_GITHUB_URL, {
            target: '_blank',
          });
        },
        icon: MdiGithub,
        text: 'GitHub',
      },
      {
        handler: () => {
          openWindow(`${VBEN_GITHUB_URL}/issues`, {
            target: '_blank',
          });
        },
        icon: CircleHelp,
        text: $t('ui.widgets.qa'),
      },
    );
  }
  return menus;
});

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

const computedUsername = computed(() => {
  return userStore.userInfo?.username;
});

async function handleLogout(logoutSuccessHandler?: () => void) {
  try {
    await authStore.logout(false);
  } finally {
    logoutSuccessHandler?.();
  }
}

function handleNoticeClear() {
  notifications.value = [];
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}

const handleChangeTenant = (tenantId: number) => {
  return authStore.changeTenant(tenantId);
};

/**
 * 修改密码
 * @param data
 */
const handleChangePassword = async (data: {
  newPassword: string;
  newPasswordConfirm: string;
  oldPassword: string;
}) => {
  await authStore.changePassword(data);
  createConfirm({
    content: $t('ui.widgets.changePassword.changePasswordSuccess'),
    onOk: () => authStore.logout(),
  });
  return true;
};
watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username} - ${userStore.userInfo?.realName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);

provide('dict-api', (codeList: string[]) => listDictItemByCodeApi(codeList));
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :change-password-handler="handleChangePassword"
        :change-tenant-handler="handleChangeTenant"
        :description="computedUsername"
        :menus
        :text="userStore.userInfo?.realName"
        :user-tenant-api="listCurrentUserTenantApi"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
