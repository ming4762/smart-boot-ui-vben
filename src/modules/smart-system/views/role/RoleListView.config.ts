import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { tableBooleanClass, tableUseYnClass } from '@/components/SmartTable';

export const getTableColumns = (): SmartColumn[] => {
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
      ...tableBooleanClass('superAdminYn'),
    },
    {
      ...tableUseYnClass(),
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

export const getSearchSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.role.table.roleName'),
      field: 'roleName',
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
      field: 'roleCode',
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
      field: 'useYn',
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

export const getAddEditFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'roleId',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.role.table.roleCode'),
      field: 'roleCode',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.role.table.roleName'),
      field: 'roleName',
      component: 'Input',
      required: true,
    },
    {
      label: t('common.table.useYn'),
      field: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('system.views.role.table.roleType'),
      field: 'roleType',
      component: 'Input',
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'InputNumber',
      required: true,
      defaultValue: 1,
    },
  ];
};
