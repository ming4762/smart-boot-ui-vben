import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';
import { $t as t } from '#/locales';
import { getUseYnSelectOptions } from '#/utils';

export enum Permission {
  delete = 'sys:tenant:package:delete',
  save = 'sys:tenant:package:save',
  setUseYn = 'sys:tenant:package:setUseYn',
  update = 'sys:tenant:package:update',
}

/**
 * 表格列表
 */
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
      field: 'packageCode',
      sortable: true,
      title: '{system.views.tenant.package.title.packageCode}',
      width: 130,
    },
    {
      field: 'packageName',
      title: '{system.views.tenant.package.title.packageName}',
      width: 120,
    },
    {
      field: 'effectTime',
      sortable: true,
      title: '{system.views.tenant.package.title.effectTime}',
      width: 165,
      type: 'dateTime',
    },
    {
      field: 'expireTime',
      sortable: true,
      title: '{system.views.tenant.package.title.expireTime}',
      width: 165,
      type: 'dateTime',
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      minWidth: 120,
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 120,
    },
    {
      ...getTableUseYnColumnClass(),
      field: 'useYn',
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
      type: 'dateTime',
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 165,
      type: 'dateTime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      label: '',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'packageCode',
      label: t('system.views.tenant.package.title.packageCode'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'packageName',
      label: t('system.views.tenant.package.title.packageName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'times',
      label: t('system.views.tenant.package.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      defaultValue: 1,
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'packageCode',
      label: t('system.views.tenant.package.title.packageCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'packageName',
      label: t('system.views.tenant.package.title.packageName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'times',
      label: t('system.views.tenant.package.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
        style: { width: '320px' },
      },
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Select',
      componentProps: {
        options: getUseYnSelectOptions(),
        style: { width: '100px' },
      },
      searchSymbol: '=',
      defaultValue: 1,
    },
  ];
};
