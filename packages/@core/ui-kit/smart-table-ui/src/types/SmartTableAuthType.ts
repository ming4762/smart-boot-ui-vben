type SmartAuthDisplayMode = 'disabled' | 'hide';

interface SmartAuthType {
  displayMode?: SmartAuthDisplayMode;
  multipleMode?: 'and' | 'or';
  permission: string | string[];
}

type SmartTableAuth = SmartAuthType | string;

interface SmartTableAuthConfig {
  /**
   * 判断权限函数
   * @param auth
   */
  authHandler: (auth?: SmartTableAuth) => boolean;
  /**
   * 默认的显示模式
   */
  displayMode?: SmartAuthDisplayMode;
}

export type { SmartAuthType, SmartTableAuth, SmartTableAuthConfig };
