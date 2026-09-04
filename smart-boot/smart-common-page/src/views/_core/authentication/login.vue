<script lang="tsx" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, unref } from 'vue';

import {
  AuthenticationLogin,
  TextCaptcha,
  useVbenModal,
  VbenInput,
  z,
} from '@vben/common-ui';
import { $t } from '@vben/locales';
import { ChangePasswordModal } from '@vben/layouts';
import { useSysPropertiesStore } from '@vben/stores';

import {
  ApiServiceEnum,
  forceChangePasswordApi,
  requestClient,
} from '@smart/common/api';
import { useAuthStore } from '@smart/common/store';
import { Col, notification, Row } from 'antdv-next';

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
const passwordChangeToken = ref('');

const [RenderForceChangePasswordModal, forceChangePasswordModalApi] =
  useVbenModal({
    connectedComponent: ChangePasswordModal,
  });

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
const handleLogin = async (loginData: Recordable<any>) => {
  const code = JSON.stringify(
    unref(captchaRef).createValidateParameter(loginData.captcha),
  );
  const username = loginData.username.trim();
  try {
    const result = await authStore.authLogin({
      code,
      password: loginData.password,
      username,
    });
    if (result?.passwordChangeRequired) {
      if (
        !result.passwordChangeToken ||
        !result.passwordValidate ||
        !result.passwordValidateErrorMessage
      ) {
        throw new Error('强制修改密码参数不完整');
      }
      passwordChangeToken.value = result.passwordChangeToken;
      sysPropertiesStore.setProperties({
        sysParameter: {
          ...sysPropertiesStore.sysParameter,
          'sys.auth.account.passwordValidate': result.passwordValidate,
          'sys.auth.account.passwordValidateErrorMessage':
            result.passwordValidateErrorMessage,
        },
      });
      forceChangePasswordModalApi.open();
    }
  } catch {
    unref(captchaRef).refresh();
  }
};

const handleForceChangePassword = async (data: {
  newPassword: string;
  newPasswordConfirm: string;
  oldPassword: string;
}) => {
  await forceChangePasswordApi(data, passwordChangeToken.value);
  passwordChangeToken.value = '';
  unref(captchaRef).refresh();
  notification.success({
    title: '密码修改成功',
    description: '请使用新密码重新登录',
  });
  return true;
};

/**
 * 单点登录跳转地址
 */
const computedIamLoginUrl = computed(() => {
  return authStore.getIamLoginUrl();
});
</script>

<template>
  <div class="w-full">
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
              <TextCaptcha
                :api="getCaptchaApi"
                height="40px"
                ref="captchaRef"
              />
            </Col>
          </Row>
        </div>
      </template>
    </AuthenticationLogin>
    <RenderForceChangePasswordModal
      :change-password-handler="handleForceChangePassword"
      :force="true"
    />
  </div>
</template>
