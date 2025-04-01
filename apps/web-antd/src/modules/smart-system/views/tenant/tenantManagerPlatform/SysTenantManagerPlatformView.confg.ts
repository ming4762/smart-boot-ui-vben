import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

export interface SysTenantProps {
  tenantId?: number;
}

/**
 * 绑定用户tab
 */
export const getTabUserListColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      title: '{system.views.tenant.manager.title.user.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.tenant.manager.title.user.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'accountId',
      title: '{system.views.tenant.manager.title.user.hasAccount}',
      formatter({ row }) {
        const accountId = row.accountId;
        if (accountId) {
          return t('common.title.yes');
        }
        return t('common.title.no');
      },
      align: 'center',
      className({ row }) {
        const accountId = row.accountId;
        if (accountId) {
          return 'text-color--success-bold';
        }
        return 'text-color--danger-bold';
      },
      width: 100,
    },
    {
      title: '{system.views.tenant.manager.title.user.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.tenant.manager.title.user.mobile}',
      field: 'mobile',
      minWidth: 140,
    },
    {
      title: '{system.views.tenant.manager.title.user.bindTime}',
      field: 'createTime',
      width: 165,
      type: 'dateTime',
    },
    {
      title: '{system.views.tenant.manager.title.user.bindBy}',
      field: 'createBy',
      width: 120,
    },
  ];
};

export const getTabUserListSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'username',
      label: t('system.views.tenant.manager.title.user.username'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'fullName',
      label: t('system.views.tenant.manager.title.user.fullName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};

/**
 * 绑定用户modal
 */
export const getBindUserModalListColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      title: '{system.views.tenant.manager.title.user.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.tenant.manager.title.user.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.tenant.manager.title.user.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.tenant.manager.title.user.mobile}',
      field: 'mobile',
      minWidth: 140,
    },
  ];
};
