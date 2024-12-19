import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
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
