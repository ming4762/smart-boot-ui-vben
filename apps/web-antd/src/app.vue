<script lang="ts" setup>
import type { SmartAppProviderProps } from '@vben/preferences';

import { computed, onMounted, toRefs } from 'vue';

import {
  ExceptionModal as ApiExceptionModal,
  LoginExpiredModal,
} from '@vben/common-ui';
import { useAntdDesignTokens } from '@vben/hooks';
import {
  preferences,
  SmartAppProvider,
  usePreferences,
} from '@vben/preferences';
import { useApiExceptionStore, useSysPropertiesStore } from '@vben/stores';

import { App, ConfigProvider, theme } from 'ant-design-vue';

import {
  feedbackExceptionApi,
  getAuthPropertiesApi,
  getSystemPropertiesApi,
} from '#/api';
import { antdLocale } from '#/locales';
import { useAuthStore, useUserProfileStore } from '#/store';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();
const { tokens } = useAntdDesignTokens();

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: tokens,
  };
});

const smartAppConfig: SmartAppProviderProps = {
  size: {
    table: 'small',
    button: 'small',
    form: 'small',
  },
};

/**
 * 异常反馈
 */
const { handleHide, exceptionNoList, modalShow } = toRefs(
  useApiExceptionStore(),
);

const { initTimeZone } = useUserProfileStore();
const { showLoginExpired, loginExpired } = toRefs(useAuthStore());
onMounted(async () => {
  // 加载系统参数
  const sysPropertiesStore = useSysPropertiesStore();
  const [authProperties, systemProperties] = await Promise.all([
    getAuthPropertiesApi(),
    getSystemPropertiesApi(),
  ]);
  sysPropertiesStore.setProperties({
    ...authProperties,
    sysParameter: systemProperties,
  });

  // 初始化时区
  initTimeZone();
});
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
    <App>
      <SmartAppProvider v-bind="smartAppConfig">
        <RouterView />
      </SmartAppProvider>
    </App>
    <!--  接口异常弹窗  -->
    <ApiExceptionModal
      :exception-no-list="exceptionNoList"
      :feedback-api="feedbackExceptionApi"
      :open="modalShow"
      @hide="handleHide"
    />
    <!--  登录过期弹窗  -->
    <LoginExpiredModal
      :open="showLoginExpired"
      @cancel="() => loginExpired(false, false)"
      @confirm="() => loginExpired(false, true)"
    />
  </ConfigProvider>
</template>
