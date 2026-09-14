<script setup lang="ts">
import type { AuthenticationSsoProps } from './types';

import { useAppConfig } from '@vben/hooks';
import {
  SvgGithubIcon,
  SvgGoogleIcon,
  SvgQQChatIcon,
  SvgShieldKeyIcon,
  SvgWeChatIcon
} from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenIconButton } from '@vben-core/shadcn-ui';

import DingdingLogin from './dingding-login.vue';
import SsoLoginButton from './sso-login-button.vue'

defineOptions({
  name: 'ThirdPartyLogin',
});

defineProps<AuthenticationSsoProps>();

const {
  auth: { dingding: dingdingAuthConfig },
} = useAppConfig(import.meta.env, import.meta.env.PROD);
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="w-[35%] border-b border-input dark:border-gray-600"></span>
      <span class="text-center text-xs text-muted-foreground uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="w-[35%] border-b border-input dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <VbenIconButton
        :tooltip="$t('authentication.wechatLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <SvgWeChatIcon />
      </VbenIconButton>
      <VbenIconButton
        :tooltip="$t('authentication.qqLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <SvgQQChatIcon />
      </VbenIconButton>
      <VbenIconButton
        :tooltip="$t('authentication.githubLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <SvgGithubIcon />
      </VbenIconButton>
      <VbenIconButton
        :tooltip="$t('authentication.googleLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <SvgGoogleIcon />
      </VbenIconButton>
      <DingdingLogin
        :corp-id="dingdingAuthConfig?.corpId"
        :client-id="dingdingAuthConfig?.clientId"
        class="mb-3"
      />

      <SsoLoginButton v-bind="$props">
        <template #icon>
          <SvgShieldKeyIcon />
        </template>
      </SsoLoginButton>
    </div>
  </div>
</template>
