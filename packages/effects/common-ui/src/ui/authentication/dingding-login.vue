<script setup lang="ts">
import { nextTick, onMounted, ref, useId } from 'vue';
import { useRoute } from 'vue-router';

import { SvgDingDingIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { alert, useVbenModal } from '@vben-core/popup-ui';
import { VbenButton, VbenIconButton } from '@vben-core/shadcn-ui';
import { loadScript } from '@vben-core/shared/utils';

interface Props {
  buttonType?: 'icon' | 'primary';
  clientId?: string;
  corpId?: string;
  // 是否直接在当前页面展示二维码
  inline?: boolean;
  // 登录回调地址
  redirectUri?: string;
  // 是否内嵌二维码登录
  isQrCode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: 'icon',
  clientId: '',
  corpId: '',
  inline: false,
  isQrCode: false,
  redirectUri: '',
});

const route = useRoute();
const containerId = `dingding_qrcode_login_${useId().replaceAll(':', '')}`;
const loginStatus = ref<'config-error' | 'error' | 'loading' | 'ready'>(
  'loading',
);

const [Modal, modalApi] = useVbenModal({
  header: false,
  footer: false,
  fullscreenButton: false,
  class: 'size-75.5 dingding-qrcode-login-modal',
  onOpened() {
    handleQrCodeLogin();
  },
});

const getRedirectUri = () => {
  const { redirectUri } = props;
  if (redirectUri) {
    return redirectUri;
  }
  return window.location.origin + route.fullPath;
};

/**
 * 内嵌二维码登录
 */
const handleQrCodeLogin = async () => {
  const { clientId, corpId } = props;
  if (!clientId || !corpId) {
    loginStatus.value = 'config-error';
    return;
  }

  loginStatus.value = 'loading';
  try {
    if (!(window as any).DTFrameLogin) {
      // 二维码登录 加载资源
      await loadScript(
        'https://g.alicdn.com/dingding/h5-dingtalk-login/0.21.0/ddlogin.js',
      );
    }
    await nextTick();
    (window as any).DTFrameLogin(
      {
        id: containerId,
        width: 300,
        height: 300,
      },
      {
        // 注意：redirect_uri 需为完整URL，扫码后钉钉会带code跳转到这里
        redirect_uri: encodeURIComponent(getRedirectUri()),
        client_id: clientId,
        scope: 'openid corpid',
        response_type: 'code',
        state: '1',
        prompt: 'consent',
        corpId,
      },
      (loginResult: any) => {
        const { redirectUrl } = loginResult;
        window.location.href = redirectUrl;
      },
      (errorMsg: string) => {
        loginStatus.value = 'error';
        alert(`Login Error: ${errorMsg}`);
      },
    );
    loginStatus.value = 'ready';
  } catch {
    loginStatus.value = 'error';
  }
};

const handleLogin = () => {
  const { clientId, corpId, isQrCode } = props;
  if (!clientId || !corpId) {
    alert($t('authentication.dingdingLoginConfigError'));
    return;
  }
  if (isQrCode) {
    // 内嵌二维码登录
    modalApi.open();
  } else {
    window.location.href = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${encodeURIComponent(getRedirectUri())}&response_type=code&client_id=${clientId}&scope=openid&corpid=${corpId}&prompt=consent`;
  }
};

onMounted(() => {
  if (props.inline) {
    void handleQrCodeLogin();
  }
});
</script>

<template>
  <div v-if="inline" class="dingding-inline-login relative size-[300px]">
    <div
      v-if="loginStatus !== 'ready'"
      aria-live="polite"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background px-6 text-center"
      role="status"
    >
      <template v-if="loginStatus === 'loading'">
        <span
          class="mb-3 size-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
        ></span>
        <span class="text-sm text-muted-foreground">
          {{ $t('authentication.dingdingQrLoading') }}
        </span>
      </template>
      <template v-else>
        <SvgDingDingIcon class="mb-3 size-9 text-muted-foreground" />
        <span class="text-sm font-medium text-foreground">
          {{
            loginStatus === 'config-error'
              ? $t('authentication.dingdingLoginConfigError')
              : $t('authentication.dingdingQrLoadError')
          }}
        </span>
        <button
          v-if="loginStatus === 'error'"
          class="mt-3 min-h-11 cursor-pointer rounded-lg px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
          @click="handleQrCodeLogin"
        >
          {{ $t('authentication.dingdingQrRetry') }}
        </button>
      </template>
    </div>
    <div :id="containerId" class="size-[300px]"></div>
  </div>
  <div v-else-if="buttonType === 'primary'" class="w-full">
    <VbenButton class="min-h-12 w-full gap-2" @click="handleLogin">
      <SvgDingDingIcon class="size-5" />
      {{ $t('authentication.dingdingQuickLogin') }}
    </VbenButton>
  </div>
  <div v-else>
    <VbenIconButton
      @click="handleLogin"
      :tooltip="$t('authentication.dingdingLogin')"
      tooltip-side="top"
    >
      <SvgDingDingIcon />
    </VbenIconButton>
    <Modal>
      <div :id="containerId"></div>
    </Modal>
  </div>
</template>

<style>
.dingding-qrcode-login-modal {
  .relative {
    padding: 0 !important;
  }
}

.dingding-inline-login iframe {
  display: block;
}
</style>
