import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /** 用户首页对应的功能 ID，由前端菜单解析为首页地址。 */
  homeFunctionId?: number | string;

  /**
   * 用户描述
   */
  // desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  // token: string;
}

interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export type { ChangePasswordParams, UserInfo };
