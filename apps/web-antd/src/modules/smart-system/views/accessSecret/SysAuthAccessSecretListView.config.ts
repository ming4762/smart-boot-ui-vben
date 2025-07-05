import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';

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
    },
    {
      field: 'tenantId',
      title: '{system.views.accessSecret.title.tenantId}',
      width: 120,
      formatter(params) {
        return params.row.tenant?.tenantName;
      },
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 100,
    },
    {
      field: 'accessKey',
      title: '{system.views.accessSecret.title.accessKey}',
      width: 120,
    },
    {
      field: 'secretKey',
      title: '{system.views.accessSecret.title.secretKey}',
      width: 120,
    },
    {
      field: 'expireDate',
      title: '{system.views.accessSecret.title.expireDate}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'accessIp',
      title: '{system.views.accessSecret.title.accessIp}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      ...getTableUseYnColumnClass(),
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 165,
      formatter: 'datetime',
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
      fieldName: 'tenantId',
      label: t('system.views.accessSecret.title.tenantId'),
      slot: 'addEdit-tenantId',
      component: 'Input',
      rules: 'required',
      controlClass: 'w-full',
    },
    {
      fieldName: 'accessKey',
      label: t('system.views.accessSecret.title.accessKey'),
      component: 'Input',
      componentProps: {},
      disabled: true,
    },
    {
      fieldName: 'secretKey',
      label: t('system.views.accessSecret.title.secretKey'),
      component: 'Input',
      componentProps: {},
      disabled: true,
    },
    {
      fieldName: 'expireDate',
      label: t('system.views.accessSecret.title.expireDate'),
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        style: { width: '100%' },
      },
    },
    {
      fieldName: 'accessIp',
      label: t('system.views.accessSecret.title.accessIp'),
      component: 'Textarea',
      componentProps: {
        placeholder: t('system.views.accessSecret.validate.accessIp'),
      },
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      rules: 'required',
      controlClass: 'w-full',
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'tenantId',
      label: t('system.views.accessSecret.title.tenantId'),
      slot: 'search-tenantId',
      searchSymbol: '=',
      component: 'Input',
    },
    {
      fieldName: 'accessKey',
      label: t('system.views.accessSecret.title.accessKey'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'secretKey',
      label: t('system.views.accessSecret.title.secretKey'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Select',
      searchSymbol: '=',
      defaultValue: 1,
      componentProps: {
        style: {
          width: '120px',
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
