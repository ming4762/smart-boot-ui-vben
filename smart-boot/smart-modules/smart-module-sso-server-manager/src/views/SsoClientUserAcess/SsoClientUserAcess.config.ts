import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { getTableUseYnColumnClass } from '@vben/common-ui';
import { $ct as t } from '@vben/locales';

import { getUseYnSelectOptions } from '@smart/common/utils';

export const getClientTableColumns = (): SmartTableColumn[] => {
  return [
    {
      field: 'clientId',
      align: 'left',
      title: '{sso.oauth2.client.title.clientId}',
      width: 120,
    },
    {
      field: 'clientName',
      align: 'left',
      title: '{sso.oauth2.client.title.clientName}',
      width: 120,
    },
    {
      field: 'clientType',
      align: 'center',
      title: '客户端类型',
      width: 100,
    },
  ];
};

export const getUserTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'user.username',
      title: '用户名',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'user.fullName',
      title: '姓名',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'clientUser.accessStrategy',
      title: '访问策略',
      width: 120,
      fixed: 'left',
      dynamicClass: ({ row }) => {
        const accessStrategy = row.clientUser?.accessStrategy;
        if (!accessStrategy) {
          return '';
        }
        return accessStrategy === 'ALLOW'
          ? 'text-color--success-bold'
          : 'text-color--danger-bold';
      },
    },
    {
      title: '邮箱',
      field: 'user.email',
      minWidth: 160,
    },
    {
      title: '手机号',
      field: 'user.mobile',
      minWidth: 140,
    },
    {
      ...getTableUseYnColumnClass('clientUser.useYn'),
      sortable: true,
    },
    {
      title: '{common.table.seq}',
      field: 'user.seq',
      width: 100,
      sortable: true,
    },
    {
      title: '绑定时间',
      field: 'clientUser.createTime',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      title: '绑定人',
      field: 'clientUser.createBy',
      width: 120,
    },
    {
      title: '{common.table.updateTime}',
      field: 'clientUser.updateTime',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      title: '{common.table.updateUser}',
      field: 'clientUser.updateBy',
      width: 120,
    },
  ];
};

/**
 * 客户端用户查询表单
 */
export const getClientUserSearchFormSchema = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'username',
      label: '用户名',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'fullName',
      label: '姓名',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'accessStrategy',
      label: '访问策略',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: 'ALLOW',
            value: 'ALLOW',
          },
          {
            label: 'DENY',
            value: 'DENY',
          },
        ],
        class: 'w-[100px]',
      },
    },
    {
      fieldName: 'clientUserUseYn',
      label: t('common.table.useYn'),
      component: 'Select',
      componentProps: {
        options: getUseYnSelectOptions(),
        class: 'w-[100px]',
      },
      defaultValue: 1,
    },
  ];
};

export const getBindModelFormSchema = (): VbenFormSchema[] => {
  return [
    {
      label: '访问策略',
      fieldName: 'accessStrategy',
      component: 'RadioGroup',
      componentProps: {
        options: ['ALLOW', 'DENY'],
        optionType: 'button',
        buttonStyle: 'solid',
      },
      rules: 'required',
    },
    {
      label: '是否启用',
      fieldName: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
  ];
};

export const getBindModelUserTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'username',
      title: '用户名',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'fullName',
      title: '姓名',
      width: 120,
      fixed: 'left',
    },
    {
      title: '邮箱',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '手机号',
      field: 'mobile',
      minWidth: 140,
    },
    {
      ...getTableUseYnColumnClass(),
      title: '用户启用状态',
      width: 110,
      sortable: true,
    },
  ];
};
