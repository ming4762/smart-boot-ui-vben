import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'code',
      title: '{system.views.system.title.code}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'name',
      title: '{system.views.system.title.name}',
      width: 160,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'enterprise',
      title: '{system.views.system.title.enterprise}',
      width: 120,
    },
    {
      field: 'version',
      title: '{system.views.system.title.version}',
      width: 120,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 170,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 170,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'id',
      title: '{common.table.operation}',
      fixed: 'right',
      width: 170,
      slots: {
        default: 'table-option',
      },
    },
  ];
};

export const getFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      label: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'code',
      label: t('system.views.system.title.code'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: t('system.views.system.title.name'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
    },
    {
      fieldName: 'enterprise',
      label: t('system.views.system.title.enterprise'),
      component: 'Input',
    },
    {
      fieldName: 'version',
      label: t('system.views.system.title.version'),
      component: 'Input',
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {
        style: 'width: 100%',
      },
      defaultValue: 1,
      rules: 'required',
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'code',
      label: t('system.views.system.title.code'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'name',
      label: t('system.views.system.title.name'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};
