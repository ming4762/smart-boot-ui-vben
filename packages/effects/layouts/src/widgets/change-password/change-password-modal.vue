<script setup lang="ts">
import { computed, unref } from 'vue';

import { $ct as t } from '@vben/locales';
import { storeToRefs, useSysPropertiesStore } from '@vben/stores';
import { useVbenForm, z } from '@vben-core/form-ui';
import { useVbenModal } from '@vben-core/popup-ui';

interface Props {
  changePasswordHandler?: (data: {
    newPassword: string;
    newPasswordConfirm: string;
    oldPassword: string;
  }) => Promise<boolean>;
}

const props = defineProps<Props>();

const { sysParameter } = storeToRefs(useSysPropertiesStore());

const computedPasswordValidate = computed(() => {
  const passwordValidate =
    unref(sysParameter)?.['sys.auth.account.passwordValidate'];
  return passwordValidate?.replaceAll('\\\\', '\\');
});

const computedPasswordValidateErrorMessage = computed(() => {
  return unref(sysParameter)?.['sys.auth.account.passwordValidateErrorMessage'];
});

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'oldPassword',
      component: 'InputPassword',
      label: t('ui.widgets.changePassword.oldPassword'),
      componentProps: {
        placeholder: t('ui.widgets.changePassword.oldPasswordPlaceholder'),
      },
      rules: 'required',
    },
    {
      fieldName: 'newPassword',
      component: 'InputPassword',
      label: t('ui.widgets.changePassword.newPassword'),
      componentProps: {
        placeholder: t('ui.widgets.changePassword.newPasswordPlaceholder'),
      },
      rules: z.string().refine(
        (value) => {
          const reg = new RegExp(unref(computedPasswordValidate));
          return reg.test(value);
        },
        {
          message: unref(computedPasswordValidateErrorMessage),
        },
      ),
    },
    {
      fieldName: 'newPasswordConfirm',
      component: 'InputPassword',
      label: t('ui.widgets.changePassword.confirmPassword'),
      componentProps: {
        placeholder: t('ui.widgets.changePassword.placeholderConfirm'),
      },
      dependencies: {
        triggerFields: ['newPassword'],
        rules: (value) => {
          const { newPassword } = value;
          if (!newPassword) {
            return 'required';
          }
          return z.string().refine((value1) => value1 === newPassword, {
            message: t('ui.widgets.changePassword.errorPasswordTip'),
          });
        },
      },
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  title: t('ui.widgets.changePassword.title'),
  onConfirm: async () => {
    if (!props.changePasswordHandler) {
      throw new Error('changePasswordApi is required');
    }
    const { valid } = await formApi.validate();
    if (!valid) {
      return false;
    }
    const { oldPassword, newPassword, newPasswordConfirm } =
      await formApi.getValues();
    try {
      modalApi.setState({ confirmLoading: true });
      await props.changePasswordHandler({
        oldPassword,
        newPassword,
        newPasswordConfirm,
      });
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  },
});
</script>

<template>
  <Modal v-bind="$attrs">
    <Form />
  </Modal>
</template>

<style scoped></style>
