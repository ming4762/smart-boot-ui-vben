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
import { createPassword } from '@vben/utils';

import { Col, Row } from 'ant-design-vue';

import { ApiServiceEnum, requestClient } from '#/api/request';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

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
      // component: markRaw(SliderCaptcha),
      // fieldName: 'captcha',
      // rules: z.boolean().refine((value) => value, {
      //   message: $t('authentication.verifyRequiredTip'),
      // }),
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
 * 执行登录操作
 */
const handleLogin = (loginData: Recordable<any>) => {
  const code = JSON.stringify(
    unref(captchaRef).createValidateParameter(loginData.captcha),
  );
  authStore
    .authLogin({
      code,
      password: createPassword(loginData.username, loginData.password),
      username: loginData.username,
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
  />
</template>
