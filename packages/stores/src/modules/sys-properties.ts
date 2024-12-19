import { defineStore } from 'pinia';

interface CaptchaProperties {
  /**
   * 是否启用验证码
   */
  captchaEnabled: boolean;
  /**
   * 验证码标识
   */
  captchaIdent: string;
  /**
   * 验证码类型
   */
  captchaType: string;
}

type SysParameterKey =
  | 'sys.auth.account.passwordValidate'
  | 'sys.auth.account.passwordValidateErrorMessage';

interface SysPropertiesState {
  captcha?: CaptchaProperties;
  sysParameter?: Record<SysParameterKey, string>;
}

export const useSysPropertiesStore = defineStore('core-sys-properties', {
  actions: {
    setProperties(properties: Partial<SysPropertiesState>) {
      Object.entries(properties).forEach(([key, value]) => {
        // @ts-ignore 忽略错误
        this[key as keyof SysPropertiesState] = value;
      });
    },
  },
  state: (): SysPropertiesState => ({
    captcha: undefined,
    sysParameter: undefined,
  }),
});
