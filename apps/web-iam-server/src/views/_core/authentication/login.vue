<script lang="tsx" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, unref } from 'vue';

import {
  AuthenticationLogin,
  TextCaptcha,
  VbenInput,
  z,
} from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { useAuthStore } from '@smart/common/store';
import { Col, Row } from 'antdv-next';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaRef = ref();

const getCaptchaApi = () => {
  return requestClient.post(
    'auth/createCaptcha',
    {},
    {
      authErrorProcessed: false,
      service: ApiServiceEnum.SMART_AUTH,
    },
  );
};

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInput',
      fieldName: 'captcha',
      slot: 'form-captcha',
      rules: z.string().min(1, { message: $t('authentication.codeTip') }),
    },
  ];
});

/**
 * 执行登录操作
 */
const handleLogin = (loginData: Recordable<any>) => {
  const code = JSON.stringify(
    unref(captchaRef).createValidateParameter(loginData.captcha),
  );
  const username = loginData.username.trim();
  authStore
    .authLogin({
      code,
      password: loginData.password,
      username,
    })
    .catch((_) => {
      unref(captchaRef).refresh();
    });
};
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleLogin"
  >
    <template #form-captcha="slotProps">
      <div style="width: 100%">
        <Row>
          <Col span="16">
            <VbenInput v-bind="slotProps.componentProps" />
          </Col>
          <Col span="8">
            <TextCaptcha :api="getCaptchaApi" height="40px" ref="captchaRef" />
          </Col>
        </Row>
      </div>
    </template>
  </AuthenticationLogin>
</template>
