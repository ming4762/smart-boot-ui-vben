import { defineStore } from 'pinia';

export type AuthMode = 'JWT' | 'SESSION';

export interface CaptchaProperties {
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

export interface AuthProperties {
  [key: string]: any;
  authMode?: AuthMode;
  captcha?: CaptchaProperties;
}

type SysParameterKey =
  | 'sys.auth.account.passwordValidate'
  | 'sys.auth.account.passwordValidateErrorMessage';

interface SysPropertiesState extends AuthProperties {
  authMode: AuthMode;
  sysParameter?: Record<SysParameterKey, string>;
}

export const useSysPropertiesStore = defineStore('core-sys-properties', {
  actions: {
    setProperties(properties: Partial<SysPropertiesState>) {
      Object.entries(properties).forEach(([key, value]) => {
        this[key as keyof SysPropertiesState] = value;
      });
    },
  },
  getters: {
    isJwtAuthMode(state): boolean {
      return state.authMode === 'JWT';
    },
    isSessionAuthMode(state): boolean {
      return state.authMode === 'SESSION';
    },
  },
  state: (): SysPropertiesState => ({
    authMode: 'JWT',
    captcha: undefined,
    sysParameter: undefined,
  }),
});
