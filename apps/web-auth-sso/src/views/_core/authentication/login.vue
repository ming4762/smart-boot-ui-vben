<script lang="tsx" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

import {
  AuthenticationLogin,
  TextCaptcha,
  VbenInput,
  z,
} from '@vben/common-ui';
import { $t } from '@vben/locales';
import { createPassword } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { Col, Row } from 'antdv-next';

import { useAuthStore } from '#/store/auth';

defineOptions({ name: 'SSOLogin' });

const route = useRoute();
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
      component: <div style="width:100%" />,
      fieldName: 'captcha',
      renderComponentContent: (value) => {
        return {
          default: () => (
            <Row>
              <Col span={16}>
                <VbenInput v-model:modelValue={value.captcha} />
              </Col>
              <Col span={8}>
                <TextCaptcha
                  api={getCaptchaApi}
                  height="40px"
                  ref={captchaRef}
                />
              </Col>
            </Row>
          ),
        };
      },
      rules: z.string().min(1, { message: $t('authentication.codeTip') }),
    },
  ];
});

/**
 * 执行 SSO 登录操作
 */
const handleLogin = (loginData: Recordable<any>) => {
  const code = JSON.stringify(
    unref(captchaRef).createValidateParameter(loginData.captcha),
  );
  const username = loginData.username.trim();

  authStore
    .authLogin({
      code,
      password: createPassword(username, loginData.password),
      username,
      clientId: route.query.client_id,
      redirectUri: route.query.redirect_uri,
      state: route.query.state,
      scope: route.query.scope,
    })
    .catch(() => {
      unref(captchaRef).refresh();
    });
};
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleLogin"
  />
</template>
