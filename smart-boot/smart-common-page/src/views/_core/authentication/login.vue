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
import { useSysPropertiesStore } from '@vben/stores';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { useAuthStore } from '@smart/common/store';
import { Col, Row } from 'antdv-next';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const sysPropertiesStore = useSysPropertiesStore();


// const MOCK_USER_OPTIONS: BasicOption[] = [
//   {
//     label: 'Super',
//     value: 'vben',
//   },
//   {
//     label: 'Admin',
//     value: 'admin',
//   },
//   {
//     label: 'User',
//     value: 'jack',
//   },
// ];

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
    // {
    //   component: 'VbenSelect',
    //   componentProps: {
    //     options: MOCK_USER_OPTIONS,
    //     placeholder: $t('authentication.selectAccount'),
    //   },
    //   fieldName: 'selectAccount',
    //   label: $t('authentication.selectAccount'),
    //   rules: z
    //     .string()
    //     .min(1, { message: $t('authentication.selectAccount') })
    //     .optional()
    //     .default('vben'),
    // },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      // dependencies: {
      //   trigger(values, form) {
      //     if (values.selectAccount) {
      //       const findUser = MOCK_USER_OPTIONS.find(
      //         (item) => item.value === values.selectAccount,
      //       );
      //       if (findUser) {
      //         form.setValues({
      //           password: '123456',
      //           username: findUser.value,
      //         });
      //       }
      //     }
      //   },
      //   triggerFields: ['selectAccount'],
      // },
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

/**
 * 单点登录跳转地址
 */
const computedIamLoginUrl = computed(() => {
  return authStore.getIamLoginUrl();
})
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :is-sso-login="sysPropertiesStore.isIamClient"
    :loading="authStore.loginLoading"
    :sso-login-url="computedIamLoginUrl"
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
