<script setup lang="ts">
import { computed, unref } from 'vue';

import { $ct as t } from '@vben/locales';
import { storeToRefs, useSysPropertiesStore } from '@vben/stores';

import { useVbenForm, z } from '@vben-core/form-ui';
import { alert, useVbenModal } from '@vben-core/popup-ui';
import { VbenButton } from '@vben-core/shadcn-ui';

/**
 * 密码修改弹窗，同时支持普通改密和登录后的强制改密场景。
 */
defineOptions({ name: 'ChangePasswordModal' });

const props = withDefaults(defineProps<Props>(), {
  force: false,
  changePasswordHandler: undefined,
});

/** 随机密码生成策略与后台 PasswordUtils 保持一致。 */
const PASSWORD_GENERATE_MAX_ATTEMPTS = 1000;
const PASSWORD_MIN_LENGTH = 15;
const PASSWORD_MAX_LENGTH = 18;
const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SPECIAL_CHARS = '%$#@&';
const ALL_PASSWORD_CHARS =
  UPPER_CASE + LOWER_CASE + DIGITS + SPECIAL_CHARS;

/** 提交给密码修改接口的表单数据。 */
interface ChangePasswordData {
  /** 新密码。 */
  newPassword: string;
  /** 新密码确认值。 */
  newPasswordConfirm: string;
  /** 用于确认当前用户身份的原密码。 */
  oldPassword: string;
}

/** 密码修改弹窗属性。 */
interface Props {
  /** 实际执行密码修改的回调，由调用方区分普通接口和强制改密接口。 */
  changePasswordHandler?: (data: ChangePasswordData) => Promise<boolean>;
  /** 是否为不可取消的强制改密模式。 */
  force?: boolean;
}

const { sysParameter } = storeToRefs(useSysPropertiesStore());

/** 后台保存的正则可能经过转义，前端使用前需要还原反斜杠。 */
const computedPasswordValidate = computed(() => {
  const passwordValidate =
    unref(sysParameter)?.['sys.auth.account.passwordValidate'];
  return passwordValidate?.replaceAll(String.raw`\\`, '\\');
});

/** 优先显示后台配置的规则说明，未配置时使用通用国际化提示。 */
const computedPasswordValidateErrorMessage = computed(() => {
  return (
    unref(sysParameter)?.['sys.auth.account.passwordValidateErrorMessage'] ||
    t('ui.widgets.changePassword.passwordStrength')
  );
});

/**
 * 检查密码是否包含连续递增的三个 ASCII 数字或字母，例如 123、abc。
 *
 * @param password 待检查的密码
 * @returns 是否包含连续递增序列
 */
function containsConsecutiveSequence(password: string): boolean {
  for (let index = 0; index < password.length - 2; index++) {
    // 越界时使用 NaN，确保无效码点不会被识别为数字或字母。
    const first = password.codePointAt(index) ?? Number.NaN;
    const second = password.codePointAt(index + 1) ?? Number.NaN;
    const third = password.codePointAt(index + 2) ?? Number.NaN;

    // 仅限制 ASCII 数字和英文字母，其他 Unicode 字符不参与连续性判断。
    const isDigitSequence = [first, second, third].every(
      (value) => value >= 48 && value <= 57,
    );
    const isLetterSequence = [first, second, third].every(
      (value) => (value >= 65 && value <= 90) || (value >= 97 && value <= 122),
    );

    // 三个字符必须属于同一类型，并且相邻码点均递增 1。
    if (
      (isDigitSequence || isLetterSequence) &&
      second - first === 1 &&
      third - second === 1
    ) {
      return true;
    }
  }
  return false;
}

/**
 * 使用系统配置的正则表达式校验密码，并排除连续递增字符序列。
 *
 * @param password 待校验的密码
 * @returns 密码是否符合规则
 */
function validatePassword(password: string): boolean {
  const passwordValidate = unref(computedPasswordValidate);

  // 未配置密码规则时不允许校验通过。
  if (!passwordValidate) {
    return false;
  }

  try {
    return (
      new RegExp(passwordValidate).test(password) &&
      !containsConsecutiveSequence(password)
    );
  } catch {
    // 系统配置的正则表达式无效时按校验失败处理。
    return false;
  }
}

/**
 * 使用浏览器安全随机源生成指定上限内的随机索引。
 * 通过拒绝采样消除直接取模造成的分布偏差。
 *
 * @param maxExclusive 随机索引的上限，不包含该值
 * @returns 大于等于 0 且小于上限的随机整数
 */
function secureRandomIndex(maxExclusive: number): number {
  const randomBytes = new Uint8Array(1);
  const acceptedUpperBound = Math.floor(256 / maxExclusive) * maxExclusive;
  let randomValue: number;
  do {
    crypto.getRandomValues(randomBytes);
    randomValue = randomBytes[0] ?? 0;
  } while (randomValue >= acceptedUpperBound);
  return randomValue % maxExclusive;
}

/**
 * 从指定字符池中安全地随机选择一个字符。
 *
 * @param characters 非空字符池
 * @returns 随机字符
 */
function getRandomCharacter(characters: string): string {
  return characters[secureRandomIndex(characters.length)] ?? '';
}

/**
 * 生成一个同时包含大小写字母、数字和特殊字符的候选密码。
 *
 * @returns 长度为 15 至 18 位的随机密码
 */
function createRandomPassword(): string {
  const passwordLength =
    PASSWORD_MIN_LENGTH +
    secureRandomIndex(PASSWORD_MAX_LENGTH - PASSWORD_MIN_LENGTH + 1);
  const characters = [
    getRandomCharacter(UPPER_CASE),
    getRandomCharacter(LOWER_CASE),
    getRandomCharacter(DIGITS),
    getRandomCharacter(SPECIAL_CHARS),
  ];
  while (characters.length < passwordLength) {
    characters.push(getRandomCharacter(ALL_PASSWORD_CHARS));
  }
  for (let index = characters.length - 1; index > 0; index--) {
    const randomIndex = secureRandomIndex(index + 1);
    [characters[index], characters[randomIndex]] = [
      characters[randomIndex] ?? '',
      characters[index] ?? '',
    ];
  }
  return characters.join('');
}

/**
 * 重复生成并校验候选密码，成功后同步填写新密码和确认密码。
 */
async function handleGeneratePassword() {
  for (let index = 0; index < PASSWORD_GENERATE_MAX_ATTEMPTS; index++) {
    const password = createRandomPassword();
    if (validatePassword(password)) {
      await formApi.setValues({
        newPassword: password,
        newPasswordConfirm: password,
      });
      return;
    }
  }
  alert(t('ui.widgets.changePassword.generatePasswordFailed'));
}

/** 表单规则与后台密码规则保持一致，并在提交前再次校验。 */
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'oldPassword',
      component: 'VbenInputPassword',
      label: t('ui.widgets.changePassword.oldPassword'),
      componentProps: {
        placeholder: t('ui.widgets.changePassword.oldPasswordPlaceholder'),
      },
      rules: 'required',
    },
    {
      fieldName: 'newPassword',
      component: 'VbenInputPassword',
      label: t('ui.widgets.changePassword.newPassword'),
      componentProps: {
        placeholder: t('ui.widgets.changePassword.newPasswordPlaceholder'),
      },
      rules: z.string().refine((value) => validatePassword(value), {
        message: unref(computedPasswordValidateErrorMessage),
      }),
    },
    {
      fieldName: 'newPasswordConfirm',
      component: 'VbenInputPassword',
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

/** 强制改密模式禁止关闭弹窗，确保用户完成改密后才能继续登录。 */
const [Modal, modalApi] = useVbenModal({
  closable: !props.force,
  closeOnClickModal: !props.force,
  closeOnPressEscape: !props.force,
  showCancelButton: !props.force,
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
    <!-- 随机密码属于辅助操作，使用次级按钮避免与确认提交争夺视觉焦点。 -->
    <div class="flex justify-end">
      <VbenButton
        :aria-label="t('ui.widgets.changePassword.generatePassword')"
        type="button"
        variant="outline"
        @click="handleGeneratePassword"
      >
        {{ t('ui.widgets.changePassword.generatePassword') }}
      </VbenButton>
    </div>
  </Modal>
</template>

<style scoped></style>
