type SmartAuthDisplayMode = 'disabled' | 'hide';

interface SmartAuthType {
  displayMode?: SmartAuthDisplayMode;
  multipleMode?: 'and' | 'or';
  permission: string | string[];
}

type SmartTableAuth = SmartAuthType | string;

interface SmartTableAuthToolbarConfig {
  delete?: SmartTableAuth;
  export?: SmartTableAuth;
  import?: SmartTableAuth;
  insert?: SmartTableAuth;
  ModalAdd?: SmartTableAuth;
  ModalEdit?: SmartTableAuth;
  query?: SmartTableAuth;
  remove?: SmartTableAuth;
}

interface SmartTableAuthConfig {
  /**
   * 判断权限函数
   * @param auth
   */
  authHandler: (auth?: SmartAuthType | string) => boolean;
  /**
   * 默认的显示模式
   */
  displayMode?: SmartAuthDisplayMode;
  toolbar?: SmartTableAuthToolbarConfig;
}

export type { SmartAuthType, SmartTableAuth, SmartTableAuthConfig };
