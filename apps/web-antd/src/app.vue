<script lang="ts" setup>
import type { SmartAppProviderProps } from '@vben/preferences';

import { computed } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import {
  preferences,
  SmartAppProvider,
  usePreferences,
} from '@vben/preferences';

import { App, ConfigProvider, theme } from 'ant-design-vue';

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
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
    <App>
      <SmartAppProvider v-bind="smartAppConfig">
        <RouterView />
      </SmartAppProvider>
    </App>
  </ConfigProvider>
</template>
