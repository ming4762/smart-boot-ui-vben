<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '@vben-core/form-ui';

import type { AuthenticationProps } from './types';

import { computed, onMounted, reactive, ref, useSlots } from 'vue';
import { useRouter } from 'vue-router';

import { SvgDingDingIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { useSysPropertiesStore } from '@vben/stores';

import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton, VbenCheckbox } from '@vben-core/shadcn-ui';

import { useMediaQuery } from '@vueuse/core';

import Title from './auth-title.vue';
import DingdingLogin from './dingding-login.vue';
import SsoLoginButton from './sso-login-button.vue';
import ThirdPartyLogin from './third-party-login.vue';

interface Props extends AuthenticationProps {
  formSchema?: VbenFormSchema[];
}

defineOptions({
  name: 'AuthenticationLogin',
});

const props = withDefaults(defineProps<Props>(), {
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  formSchema: () => [],
  isSsoLogin: false,
  loading: false,
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: false,
  showForgetPassword: true,
  showKeepLogin: false,
  showQrcodeLogin: false,
  showRegister: false,
  showRememberMe: true,
  showThirdPartyLogin: true,
  submitButtonText: '',
  subTitle: '',
  title: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

const [Form, formApi] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: computed(() => props.formSchema),
    showDefaultActions: false,
  }),
);

const slots = useSlots();

const formSlotNames = computed(() => {
  return Object.keys(slots).filter((slotName) => slotName.startsWith('form-'));
});

const router = useRouter();
const sysPropertiesStore = useSysPropertiesStore();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const rememberMe = ref(!!localUsername);
const keepLogin = ref(true);
// 平板及桌面端保留扫码入口，仅在手机端切换为钉钉 OAuth 快捷登录。
const showDingdingQrCode = useMediaQuery('(min-width: 768px)');
const isDingdingSplitBreakpoint = useMediaQuery('(min-width: 1280px)');
const showDingtalkLogin = computed(
  () => !!sysPropertiesStore.dingtalk?.clientId,
);
// 仅在二维码与账号登录实际并排展示时使用宽版登录布局。
const useDingdingSplitLayout = computed(
  () =>
    !props.isSsoLogin &&
    showDingtalkLogin.value &&
    showDingdingQrCode.value &&
    isDingdingSplitBreakpoint.value,
);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    localStorage.setItem(
      REMEMBER_ME_KEY,
      rememberMe.value ? values?.username : '',
    );
    // Spring Security 使用 remember-me 参数决定是否签发持久登录 Cookie。
    emit('submit', {
      ...values,
      'remember-me': keepLogin.value,
    });
  }
}

function handleGo(path: string) {
  router.push(path);
}

function handleEnter(event: KeyboardEvent) {
  if (event.target instanceof HTMLInputElement) {
    event.preventDefault();
    void handleSubmit();
  }
}

onMounted(() => {
  if (localUsername) {
    formApi.setFieldValue('username', localUsername);
  }
});

defineExpose({
  getFormApi: () => formApi,
});
</script>

<template>
  <div
    class="authentication-login w-full"
    :class="
      useDingdingSplitLayout
        ? 'authentication-login--split max-w-[46rem]!'
        : 'authentication-login--compact max-w-md!'
    "
    @keydown.enter="handleEnter"
  >
    <slot name="title">
      <Title>
        <slot name="title">
          {{ title || $t('authentication.welcomeBack') }}
        </slot>
        <template #desc>
          <span class="text-muted-foreground">
            <slot name="subTitle">
              {{ subTitle || $t('authentication.loginMethodSubtitle') }}
            </slot>
          </span>
        </template>
      </Title>
    </slot>

    <!-- SSO单点登录模式 -->
    <template v-if="isSsoLogin">
      <div class="flex flex-col items-center justify-center py-8">
        <slot name="sso-icon">
          <div
            class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <svg
              class="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </slot>
        <p class="mb-6 text-center text-sm text-muted-foreground">
          {{ $t('authentication.ssoLoginTip') }}
        </p>
        <SsoLoginButton
          :sso-login-url="ssoLoginUrl"
          sso-button-type="primary"
        />
      </div>
    </template>

    <!-- 常规登录模式 -->
    <template v-else>
      <div
        class="grid items-stretch overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm"
        :class="
          useDingdingSplitLayout
            ? 'grid-cols-1 xl:grid-cols-[332px_minmax(300px,1fr)]'
            : 'grid-cols-1'
        "
      >
        <section
          v-if="showDingtalkLogin"
          :class="
            showDingdingQrCode
              ? 'justify-start border-b border-border/70 bg-background p-4 xl:border-r xl:border-b-0'
              : 'justify-center p-5 pb-0'
          "
          aria-labelledby="dingding-login-title"
          class="flex flex-col"
        >
          <div
            class="mb-4 flex items-center"
            :class="showDingdingQrCode ? 'gap-3 px-1 pt-1' : 'justify-center'"
          >
            <span
              v-if="showDingdingQrCode"
              class="flex size-10 items-center justify-center rounded-xl bg-[#1677ff]/10 text-[#1677ff]"
            >
              <SvgDingDingIcon class="size-6" />
            </span>
            <div :class="{ 'text-center': !showDingdingQrCode }">
              <h2
                id="dingding-login-title"
                class="text-base font-semibold text-foreground"
              >
                {{
                  showDingdingQrCode
                    ? $t('authentication.dingdingScanTitle')
                    : $t('authentication.dingdingMobileTitle')
                }}
              </h2>
              <p class="mt-0.5 text-xs leading-5 text-muted-foreground">
                {{
                  showDingdingQrCode
                    ? $t('authentication.dingdingScanSubtitle')
                    : $t('authentication.dingdingMobileSubtitle')
                }}
              </p>
            </div>
          </div>

          <template v-if="showDingdingQrCode">
            <!-- 浅色模式与 iframe 白底融合；暗黑模式为第三方 iframe 保留独立扫码区域。 -->
            <div class="mx-auto overflow-hidden rounded-xl">
              <DingdingLogin
                :client-id="sysPropertiesStore.dingtalk?.clientId"
                :corp-id="sysPropertiesStore.dingtalk?.corpId"
                :redirect-uri="sysPropertiesStore.dingtalk?.redirectUri"
                inline
                is-qr-code
              />
            </div>
            <p
              class="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
            >
              <svg
                aria-hidden="true"
                class="size-3.5 text-primary"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 6 9 17l-5-5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ $t('authentication.dingdingScanSecureTip') }}
            </p>
          </template>
          <DingdingLogin
            v-else
            :client-id="sysPropertiesStore.dingtalk?.clientId"
            :corp-id="sysPropertiesStore.dingtalk?.corpId"
            :redirect-uri="sysPropertiesStore.dingtalk?.redirectUri"
            button-type="primary"
          />
        </section>

        <div
          v-if="showDingtalkLogin && !showDingdingQrCode"
          class="flex items-center gap-3 px-5 pt-5 text-xs text-muted-foreground"
        >
          <span class="h-px flex-1 bg-border"></span>
          {{ $t('authentication.orAccountLogin') }}
          <span class="h-px flex-1 bg-border"></span>
        </div>

        <section
          aria-labelledby="account-login-title"
          class="min-w-0 p-5 sm:p-6 xl:p-8"
        >
          <div class="mb-5">
            <h2
              id="account-login-title"
              class="text-base font-semibold text-foreground"
            >
              {{ $t('authentication.accountPasswordLogin') }}
            </h2>
            <p class="mt-1 text-xs leading-5 text-muted-foreground">
              {{ $t('authentication.accountPasswordSubtitle') }}
            </p>
          </div>

          <Form>
            <template
              v-for="slotName in formSlotNames"
              :key="slotName"
              #[slotName]="slotProps"
            >
              <slot :name="slotName" v-bind="slotProps"></slot>
            </template>
          </Form>

          <div
            v-if="showRememberMe || showKeepLogin || showForgetPassword"
            class="mb-6 flex items-start justify-between gap-3"
          >
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <VbenCheckbox
                v-if="showRememberMe"
                v-model="rememberMe"
                name="rememberMe"
              >
                {{ $t('authentication.rememberMe') }}
              </VbenCheckbox>
              <VbenCheckbox
                v-if="showKeepLogin"
                v-model="keepLogin"
                name="keepLogin"
              >
                {{ $t('authentication.keepLogin') }}
              </VbenCheckbox>
            </div>

            <button
              v-if="showForgetPassword"
              class="vben-link min-h-11 shrink-0 cursor-pointer text-sm font-normal"
              type="button"
              @click="handleGo(forgetPasswordPath || '')"
            >
              {{ $t('authentication.forgetPassword') }}
            </button>
          </div>
          <VbenButton
            :class="{
              'cursor-wait': loading,
            }"
            :disabled="loading"
            :loading="loading"
            aria-label="login"
            class="min-h-11 w-full"
            @click="handleSubmit"
          >
            {{ submitButtonText || $t('common.login') }}
          </VbenButton>

          <div
            v-if="showCodeLogin"
            class="mt-4 mb-2 flex items-center justify-between"
          >
            <VbenButton
              class="min-h-11 w-full"
              variant="outline"
              @click="handleGo(codeLoginPath || '')"
            >
              {{ $t('authentication.mobileLogin') }}
            </VbenButton>
          </div>

          <slot name="third-party-login">
            <ThirdPartyLogin
              v-if="showThirdPartyLogin"
              sso-button-type="icon"
            />
          </slot>

          <slot name="to-register">
            <div v-if="showRegister" class="mt-3 text-center text-sm">
              {{ $t('authentication.accountTip') }}
              <button
                class="vben-link min-h-11 cursor-pointer px-1 text-sm font-normal"
                type="button"
                @click="handleGo(registerPath || '')"
              >
                {{ $t('authentication.createAccount') }}
              </button>
            </div>
          </slot>
        </section>
      </div>
    </template>
  </div>
</template>
