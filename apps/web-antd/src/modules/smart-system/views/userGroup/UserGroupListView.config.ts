import type { SmartSearchFormSchema, SmartTableColumn } from '@vben/common-ui';

import type { VbenFormSchema } from '#/adapter/form';

import { getTableUseYnColumnClass } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

export const Permission = {
  add: 'sys:userGroup:save',
  delete: 'sys:userGroup:delete',
  update: 'sys:userGroup:update',
  setUser: 'sys:userGroup:setUser',
  useYn: 'sys:userGroup:useYn',
};

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      title: '{system.views.userGroup.table.groupCode}',
      field: 'groupCode',
      fixed: 'left',
      width: 160,
    },
    {
      title: '{system.views.userGroup.table.groupName}',
      field: 'groupName',
      fixed: 'left',
      width: 120,
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

export const getSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.userGroup.table.groupCode'),
      fieldName: 'groupCode',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.userGroup.table.groupName'),
      fieldName: 'groupName',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('common.table.useYn'),
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
      label: t('system.views.userGroup.table.groupCode'),
      fieldName: 'groupCode',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.userGroup.table.groupName'),
      fieldName: 'groupName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('common.table.useYn'),
      fieldName: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'InputNumber',
      defaultValue: 1,
      rules: 'required',
    },
    {
      label: t('common.table.remark'),
      fieldName: 'remark',
      component: 'Textarea',
    },
  ];
};
