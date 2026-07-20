<script setup lang="ts">
import type { AuthenticationSsoProps } from './types';

import { createIconifyIcon } from '@vben/icons';

import { VbenButton, VbenIconButton } from '@vben-core/shadcn-ui';

const props = withDefaults(defineProps<AuthenticationSsoProps>(), {
  ssoButtonType: 'primary',
});

const SvgSsoIcon = createIconifyIcon('ant-design:security-scan-outlined');

/**
 * 跳转到sso登录地址
 */
const handleSsoLogin = () => {
  if (!props.ssoLoginUrl) {
    // 显示错误提示
    console.error('SSO 配置未就绪');
    return;
  }

  // 记录当前前端地址（可选，用于 SSO 回调后跳转）
  const redirectUrl = encodeURIComponent(window.location.href);

  // 跳转到 SSO 地址
  window.location.href = `${props.ssoLoginUrl}?frontend_redirect_uri=${redirectUrl}`;
};

</script>

<template>
  <!-- 主按钮模式（onlySsoLogin=true 时使用） -->
  <VbenButton
    v-if="ssoButtonType === 'primary'"
    class="w-full"
    size="lg"
    @click="handleSsoLogin"
  >
    <slot name="icon">
      <SvgSsoIcon />
    </slot>
    {{ $t('authentication.ssoLogin') }}
  </VbenButton>

  <!-- 图标按钮模式（第三方登录区使用） -->
  <VbenIconButton
    v-else
    :tooltip="$t('authentication.ssoLogin')"
    tooltip-side="top"
    @click="handleSsoLogin"
  >
    <slot name="icon">
      <SvgSsoIcon />
    </slot>
  </VbenIconButton>
</template>

<style scoped></style>
