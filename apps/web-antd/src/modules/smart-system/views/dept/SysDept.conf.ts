import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

export const getUserColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
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
      title: '{common.table.seq}',
      field: 'seq',
      width: 100,
      sortable: true,
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
      type: 'dateTime',
    },
    {
      title: '{common.table.createUser}',
      field: 'createBy',
      width: 120,
    },
    {
      title: '{common.table.updateTime}',
      field: 'updateTime',
      width: 165,
      sortable: true,
      type: 'dateTime',
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
      width: 120,
    },
  ];
};

export const getUserSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.user.table.username'),
      fieldName: 'username',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.username'),
      },
    },
    {
      label: t('system.views.user.table.fullName'),
      fieldName: 'fullName',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.fullName'),
      },
    },
  ];
};
