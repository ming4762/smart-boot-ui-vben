interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

/**
 * 用户角色
 */
interface UserRole {
  /**
   * 角色编码
   */
  roleCode: string;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 是否超级管理员角色
   */
  superAdminYn: boolean;
}

/**
 * 用户租户信息
 */
interface UserTenant {
  /**
   * 是否平台管理租户
   */
  platformYn: boolean;
  /**
   * 租户编码
   */
  tenantCode: string;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 租户名称
   */
  tenantName: string;
  /**
   * 租户简称
   */
  tenantShortName?: string;
}

interface BasicUserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户权限=realName
   */
  fullName: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: UserRole[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 用户登录所属租户
   */
  userTenant: UserTenant;
}

export type {
  BasicOption,
  BasicUserInfo,
  SelectOption,
  TabOption,
  UserRole,
  UserTenant,
};
