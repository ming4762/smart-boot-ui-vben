<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue';

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

const containerId = `dingding_qrcode_login_${useId().replaceAll(':', '')}`;
const loginStatus = ref<'config-error' | 'error' | 'loading' | 'ready'>(
  'loading',
);
let qrLoginAttempt = 0;

const [Modal, modalApi] = useVbenModal({
  header: false,
  footer: false,
  fullscreenButton: false,
  class: 'size-75.5 dingding-qrcode-login-modal',
  onOpened() {
    handleQrCodeLogin();
  },
  onClosed() {
    // 关闭弹窗后，旧二维码的回调不能再触发登录或错误弹窗。
    qrLoginAttempt += 1;
  },
});

/**
 * 初始化当前一轮二维码登录，并忽略 SDK 留下的旧回调。
 */
const handleQrCodeLogin = async () => {
  const attempt = ++qrLoginAttempt;
  const { clientId, corpId, redirectUri } = props;
  // 回调地址必须由服务端配置，避免当前页面 URL 变化导致钉钉回调不一致。
  if (!clientId || !redirectUri?.trim()) {
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
    if (attempt !== qrLoginAttempt) return;

    let handled = false;
    (window as any).DTFrameLogin(
      {
        id: containerId,
        // 钉钉仅用宽高设置 iframe，内部二维码及留白需要完整的显示区域。
        width: 300,
        height: 300,
      },
      {
        // 注意：redirect_uri 需为完整URL，扫码后钉钉会带code跳转到这里
        redirect_uri: encodeURIComponent(redirectUri),
        client_id: clientId,
        scope: 'openid corpid',
        response_type: 'code',
        state: '1',
        prompt: 'consent',
        // 未限定组织时省略 corpId，由钉钉让用户选择登录组织。
        ...(corpId ? { corpId } : {}),
      },
      (loginResult: any) => {
        // SDK 重新初始化后可能继续调用旧回调；每轮仅处理首次结果。
        if (attempt !== qrLoginAttempt || handled) {
          return;
        }
        handled = true;
        const { redirectUrl } = loginResult;
        window.location.href = redirectUrl;
      },
      (errorMsg: string) => {
        if (attempt !== qrLoginAttempt || handled) {
          return;
        }
        handled = true;
        console.error(errorMsg);
        loginStatus.value = 'error';
        alert(`Login Error: ${errorMsg}`);
      },
    );
    if (attempt === qrLoginAttempt && !handled) {
      loginStatus.value = 'ready';
    }
  } catch {
    if (attempt === qrLoginAttempt) {
      loginStatus.value = 'error';
    }
  }
};

const handleLogin = () => {
  const { clientId, corpId, isQrCode, redirectUri } = props;
  if (!clientId || !redirectUri?.trim()) {
    alert($t('authentication.dingdingLoginConfigError'));
    return;
  }
  if (isQrCode) {
    // 内嵌二维码登录
    modalApi.open();
  } else {
    // 未限定组织时不传 corpid，保留钉钉的组织选择流程。
    window.location.href = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&client_id=${clientId}&scope=openid&prompt=consent${corpId ? `&corpid=${encodeURIComponent(corpId)}` : ''}`;
  }
};

onMounted(() => {
  if (props.inline) {
    void handleQrCodeLogin();
  }
});

onBeforeUnmount(() => {
  qrLoginAttempt += 1;
});
</script>

<template>
  <div v-if="inline" class="dingding-inline-login relative size-[300px]">
    <div
      v-if="loginStatus !== 'ready'"
      aria-live="polite"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background px-6 text-center"
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
    <!-- SDK 不支持主题色，暗黑模式调低亮度并保留深色二维码，避免反相影响扫码。 -->
    <div :id="containerId" class="size-[300px] dark:brightness-[0.65]"></div>
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
