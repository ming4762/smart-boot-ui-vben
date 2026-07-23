<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '@vben-core/form-ui';

import type { AuthenticationProps } from './types';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';

import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton, VbenCheckbox } from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';
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
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
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
const router = useRouter();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const rememberMe = ref(!!localUsername);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    localStorage.setItem(
      REMEMBER_ME_KEY,
      rememberMe.value ? values?.username : '',
    );
    emit('submit', values);
  }
}

function handleGo(path: string) {
  router.push(path);
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
  <div @keydown.enter.prevent="handleSubmit">
    <slot name="title">
      <Title>
        <slot name="title">
          {{ title || `${$t('authentication.welcomeBack')} 👋🏻` }}
        </slot>
        <template #desc>
          <span class="text-muted-foreground">
            <slot name="subTitle">
              {{ subTitle || $t('authentication.loginSubtitle') }}
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
      <Form />

      <div
        v-if="showRememberMe || showForgetPassword"
        class="mb-6 flex justify-between"
      >
        <div class="flex-center">
          <VbenCheckbox
            v-if="showRememberMe"
            v-model="rememberMe"
            name="rememberMe"
          >
            {{ $t('authentication.rememberMe') }}
          </VbenCheckbox>
        </div>

        <span
          v-if="showForgetPassword"
          class="vben-link text-sm font-normal"
          @click="handleGo(forgetPasswordPath || '')"
        >
          {{ $t('authentication.forgetPassword') }}
        </span>
      </div>
      <VbenButton
        :class="{
          'cursor-wait': loading,
        }"
        :loading="loading"
        aria-label="login"
        class="w-full"
        @click="handleSubmit"
      >
        {{ submitButtonText || $t('common.login') }}
      </VbenButton>

      <div
        v-if="showCodeLogin || showQrcodeLogin"
        class="mt-4 mb-2 flex items-center justify-between"
      >
        <VbenButton
          v-if="showCodeLogin"
          class="w-1/2"
          variant="outline"
          @click="handleGo(codeLoginPath || '')"
        >
          {{ $t('authentication.mobileLogin') }}
        </VbenButton>
        <VbenButton
          v-if="showQrcodeLogin"
          class="ml-4 w-1/2"
          variant="outline"
          @click="handleGo(qrCodeLoginPath || '')"
        >
          {{ $t('authentication.qrcodeLogin') }}
        </VbenButton>
      </div>

      <!-- 第三方登录 -->
      <slot name="third-party-login">
        <ThirdPartyLogin sso-button-type="icon" v-if="showThirdPartyLogin" />
      </slot>

      <slot name="to-register">
        <div v-if="showRegister" class="mt-3 text-center text-sm">
          {{ $t('authentication.accountTip') }}
          <span
            class="vben-link text-sm font-normal"
            @click="handleGo(registerPath || '')"
          >
            {{ $t('authentication.createAccount') }}
          </span>
        </div>
      </slot>
    </template>
  </div>
</template>
