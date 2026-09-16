<script lang="ts" setup>
import {computed, toRefs} from 'vue';

import {
  ExceptionModal as ApiExceptionModal,
} from '@vben/common-ui';
import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';
import { useApiExceptionStore } from '@vben/stores';

import {feedbackExceptionApi} from '@smart/common/api';
import { App, ConfigProvider, theme } from 'antdv-next';

import { antdLocale } from '#/locales';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();
const { tokens } = useAntdDesignTokens();

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: tokens,
  };
});

/**
 * 异常反馈
 */
const { handleHide, exceptionNoList, modalShow } = toRefs(
  useApiExceptionStore(),
);
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
    <App>
      <RouterView />
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
