import type { SmartAuthType } from '@vben-core/typings';

type SmartAuthDisplayMode = 'disabled' | 'hide';

interface SmartTableAuthConfig {
  /**
   * 判断权限函数
   * @param auth
   */
  authHandler: (auth?: SmartAuthType) => boolean;
  /**
   * 默认的显示模式
   */
  displayMode?: SmartAuthDisplayMode;
}

export type { SmartTableAuthConfig };
