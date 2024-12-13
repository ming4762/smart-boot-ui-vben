<script lang="ts" setup>
import type { SmartAppProviderProps } from '@vben/preferences';

import { computed, toRefs } from 'vue';

import { ExceptionModal as ApiExceptionModal } from '@vben/common-ui';
import { useAntdDesignTokens } from '@vben/hooks';
import {
  preferences,
  SmartAppProvider,
  usePreferences,
} from '@vben/preferences';
import { useApiExceptionStore } from '@vben/stores';

import { App, ConfigProvider, theme } from 'ant-design-vue';

import { feedbackExceptionApi } from '#/api';
import { antdLocale } from '#/locales';

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

const { handleHide, exceptionNoList, modalShow } = toRefs(
  useApiExceptionStore(),
);
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
  </ConfigProvider>
</template>
