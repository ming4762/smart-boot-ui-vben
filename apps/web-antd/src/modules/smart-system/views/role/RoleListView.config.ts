import type { SmartSearchFormSchema, SmartTableColumn } from '@vben/common-ui';

import type { VbenFormSchema } from '#/adapter/form';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

export const Permission = {
  add: 'sys:role:save',
  delete: 'sys:role:delete',
  update: 'sys:role:update',
  setRoleUser: 'sys:role:setRoleUser',
  setFunction: 'sys:role:setFunction',
};

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.role.table.roleName}',
      field: 'roleName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.role.table.roleCode}',
      field: 'roleCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: '{system.views.role.table.roleType}',
      field: 'roleType',
      width: 120,
    },
    {
      title: '{system.views.role.table.superAdminYn}',
      field: 'superAdminYn',
      width: 120,
      ...getTableBooleanColumnClass('superAdminYn'),
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      minWidth: 160,
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

export const getSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.role.table.roleName'),
      fieldName: 'roleName',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: {
          width: '130px',
        },
      },
    },
    {
      label: t('system.views.role.table.roleCode'),
      fieldName: 'roleCode',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: {
          width: '130px',
        },
      },
    },
    {
      label: t('common.title.useYn'),
      fieldName: 'useYn',
      component: 'Select',
      defaultValue: 1,
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '100px',
        },
        options: [
          {
            label: t('common.form.use'),
            value: 1,
          },
          {
            label: t('common.form.noUse'),
            value: 0,
          },
        ],
      },
    },
  ];
};

export const getAddEditFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'groupId',
      component: 'Input',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      label: t('system.views.role.table.roleCode'),
      fieldName: 'roleCode',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.role.table.roleName'),
      fieldName: 'roleName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('common.title.useYn'),
      fieldName: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('system.views.role.table.roleType'),
      fieldName: 'roleType',
      component: 'Input',
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
    },
  ];
};
