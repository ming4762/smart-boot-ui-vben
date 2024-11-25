/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

/**
 * @zh_CN 默认首页地址
 */
export const DEFAULT_HOME_PATH = '/dashboard';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];

export enum ApiServiceEnum {
  NONE = '',
  SMART_AUTH = 'smart-auth',
  // 代码生成器
  SMART_CODE = 'smart-code',
  SMART_FILE = 'smart-file',
  // 消息服务，包括短信等
  SMART_MESSAGE = 'smart-message',
  SMART_SYSTEM = 'smart-system',
}
