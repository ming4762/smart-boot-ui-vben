/** 页面标签页及其访问权限配置。 */
export const clientPermissionTabs = [
  {
    key: 'function',
    label: '功能菜单',
    permission: 'iam:client:function:query',
  },
  { key: 'role', label: '角色', permission: 'iam:client:role:query' },
  {
    key: 'package',
    label: '租户套餐',
    permission: 'iam:client:tenant-package:query',
  },
  {
    key: 'subscription',
    label: '租户订阅',
    permission: 'iam:client:tenant-subscription:query',
  },
];

export type ClientPermissionTab = (typeof clientPermissionTabs)[number];

/** 请求白名单避免向管理端提交表格内部字段、审计字段或客户端归属字段。 */
export const resourceFields: Record<string, string[]> = {
  function: [
    'functionId',
    'parentId',
    'functionName',
    'functionType',
    'i18nCode',
    'icon',
    'seq',
    'url',
    'permission',
    'isMenu',
    'isMicroFrontend',
    'internalOrExternal',
    'dataRule',
    'httpMethod',
    'component',
    'componentName',
    'redirect',
    'cached',
    'meta',
    'useYn',
    'microFrontend',
  ],
  role: [
    'roleId',
    'tenantId',
    'roleName',
    'roleCode',
    'superAdminYn',
    'remark',
    'useYn',
    'roleType',
    'seq',
  ],
  'tenant-package': [
    'id',
    'packageCode',
    'packageName',
    'effectTime',
    'expireTime',
    'remark',
    'seq',
    'useYn',
  ],
  'tenant-subscription': [
    'id',
    'tenantId',
    'packageId',
    'effectTime',
    'expireTime',
    'remark',
    'userNumber',
    'useYn',
  ],
};

/** 功能类型名称与后端枚举值的映射，用于兼容表格筛选条件。 */
export const functionTypeValues: Record<string, string> = {
  CATALOG: '10',
  FUNCTION: '30',
  MENU: '20',
};

/**
 * 生成指定资源的表格操作权限。
 * @param domain IAM Admin 接口中的资源域
 */
export const getResourcePermissions = (domain: string) => ({
  add: `iam:client:${domain}:save`,
  delete: `iam:client:${domain}:delete`,
  save: `iam:client:${domain}:save`,
  setRoleUser: 'iam:client:role:grant-user',
  setUseYn: `iam:client:${domain}:save`,
  update: `iam:client:${domain}:save`,
});

/** 租户订阅面板使用的操作权限配置。 */
export const subscriptionPermissions = {
  subscribeAddUpdate: 'iam:client:tenant-subscription:save',
  subscribeDelete: 'iam:client:tenant-subscription:delete',
  subscribeSetUseYn: 'iam:client:tenant-subscription:save',
};
