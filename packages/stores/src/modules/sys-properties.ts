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
  // 是否IAM客户端
  iamClient?: boolean;
  /**
   * IAM登录地址
   */
  iamLoginUrl?: string;
  // 单点登录是否自动跳转
  ssoAutoRedirect?: boolean;
}

type SysParameterKey =
  | 'sys.auth.account.passwordValidate'
  | 'sys.auth.account.passwordValidateErrorMessage'
  | 'sys.function.favorite.maxCount';

interface SysPropertiesState extends AuthProperties {
  sysParameter?: Partial<Record<SysParameterKey, string>>;
}

export const useSysPropertiesStore = defineStore('core-sys-properties', {
  actions: {
    setProperties(properties: Partial<SysPropertiesState>) {
      Object.entries(properties).forEach(([key, value]) => {
        this[key as keyof SysPropertiesState] = value;
      });
    },
    $reset() {
      // 重写函数，系统参数不reset
    },
  },
  getters: {
    isJwtAuthMode(state): boolean {
      return state.authMode === 'JWT';
    },
    isSessionAuthMode(state): boolean {
      return state.authMode === 'SESSION';
    },
    isIamClient(state): boolean {
      return state.iamClient || false;
    },
  },
  state: (): SysPropertiesState => ({
    authMode: 'JWT',
    captcha: undefined,
    sysParameter: undefined,
    iamClient: false,
    iamLoginUrl: undefined,
    ssoAutoRedirect: false,
  }),
});
