import type { Ref } from 'vue';

import type { SmartSearchFormSchema, SmartTableColumn } from '@vben/common-ui';

import { unref } from 'vue';

import { getTableBooleanColumnClass } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { formatDurationStr } from '@vben/utils';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      title: '#',
      type: 'expand',
      fixed: 'left',
      width: 80,
      slots: {
        content: 'table-expand',
      },
    },
    {
      title: '{system.views.user.table.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.user.table.mobile}',
      field: 'mobile',
      minWidth: 140,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getTableExpandColumns = (): SmartTableColumn[] => {
  return [
    {
      title: '{system.views.onlineUser.title.authType}',
      field: 'authType',
      width: 120,
    },
    {
      title: '{system.views.onlineUser.title.loginType}',
      field: 'loginType',
      width: 120,
    },
    {
      title: '{system.views.onlineUser.title.loginTime}',
      field: 'loginTime',
      sortable: true,
      width: 170,
      formatter: 'datetime',
    },
    {
      title: '{system.views.onlineUser.title.loginIp}',
      field: 'loginIp',
      minWidth: 200,
    },
    {
      title: '{system.views.onlineUser.title.timeout}',
      field: 'timeout',
      width: 150,
      formatter({ row }: any) {
        const timeout = row.timeout;
        if (!timeout) {
          return '';
        }
        return formatDurationStr(timeout);
      },
    },
    {
      title: '{system.views.onlineUser.title.loginDuration}',
      field: 'loginDuration',
      width: 150,
      formatter({ row }: any) {
        const loginDuration = row.loginDuration;
        if (!loginDuration) {
          return '';
        }
        return formatDurationStr(loginDuration);
      },
    },
    {
      title: '{system.views.onlineUser.title.tenantCode}',
      field: 'tenantCode',
      width: 150,
    },
    {
      title: '{system.views.onlineUser.title.tenantName}',
      field: 'tenantName',
      width: 100,
      formatter({ row }) {
        return row.tenantShotName || row.tenantName;
      },
    },
    {
      ...getTableBooleanColumnClass('bindIp'),
      title: '{system.views.onlineUser.title.bindIp}',
      width: 120,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'expand-table-operation',
      },
    },
  ];
};

export const getSearchFormSchemas = (
  getIsPlatformTenant: Ref<boolean>,
): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.user.table.username'),
      fieldName: 'username',
      component: 'Input',
    },
    {
      label: t('system.views.onlineUser.title.tenant'),
      fieldName: 'tenantId',
      slot: 'search-tenantId',
      component: 'Input',
      dependencies: {
        triggerFields: ['tenantId'],
        show: unref(getIsPlatformTenant),
      },
    },
  ];
};
