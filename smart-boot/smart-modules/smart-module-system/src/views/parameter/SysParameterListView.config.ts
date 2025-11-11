import type {
  VbenFormSchema as FormSchema,
  SmartSearchFormSchema,
  SmartTableColumn,
} from '@vben/common-ui';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

export enum Permissions {
  delete = 'sys:parameter:delete',
  query = 'sys:parameter:query',
  save = 'sys:parameter:save',
  setUseYn = 'sys:parameter:setUseYn',
  update = 'sys:parameter:update',
  updateBuildIn = 'sys:parameter:updateBuildIn',
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
    },
    {
      field: 'code',
      fixed: 'left',
      title: '{system.views.parameter.title.code}',
      width: 160,
    },
    {
      field: 'name',
      fixed: 'left',
      title: '{system.views.parameter.title.name}',
      width: 160,
    },
    {
      field: 'commonParameter',
      title: '通用值',
      minWidth: 200,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      ...getTableBooleanColumnClass('buildIn'),
      sortable: true,
      title: '{system.views.parameter.title.buildIn}',
      width: 100,
      align: 'center',
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 120,
    },
    {
      field: 'createTime',
      sortable: true,
      title: '{common.table.createTime}',
      width: 160,
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
      width: 160,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
      title: '{common.title.useYn}',
      width: 90,
      align: 'center',
    },
    {
      field: 'operation',
      title: '{common.table.operation}',
      width: 120,
      slots: {
        default: 'table-operation',
      },
      fixed: 'right',
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (t: (arg: string) => string): FormSchema[] => {
  return [
    {
      fieldName: 'id',
      label: 'id',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'buildIn',
      label: '',
      component: 'Radio',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'code',
      label: t('system.views.parameter.title.code'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
      dependencies: {
        triggerFields: ['code'],
        disabled: (value) => {
          const { buildIn } = value;
          return buildIn === true;
        },
      },
    },
    {
      fieldName: 'name',
      label: t('system.views.parameter.title.name'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {
        style: {
          width: '100%',
        },
      },
      rules: 'required',
      defaultValue: 1,
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'code',
      label: t('system.views.parameter.title.code'),
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {},
    },
    {
      fieldName: 'name',
      label: t('system.views.parameter.title.name'),
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {},
    },
    {
      fieldName: 'buildIn',
      label: t('system.views.parameter.title.buildIn'),
      component: 'Select',
      componentProps: {
        style: {
          width: '100px',
        },
        options: [
          {
            label: 'Y',
            value: 1,
          },
          {
            label: 'N',
            value: 0,
          },
        ],
      },
      searchSymbol: '=',
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Select',
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
      searchSymbol: '=',
    },
  ];
};

/**
 * 表格列表
 */
export const getParameterTenantTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'parameter',
      align: 'left',
      title: '{system.views.parameter.title.parameter}',
      minWidth: 200,
    },
    {
      field: 'tenantId',
      title: '所属租户',
      width: 120,
      formatter: ({ row }) => {
        const { tenantId, tenant } = row;
        if (tenantId === -1) {
          return '通用参数';
        }
        return tenant?.tenantName;
      },
    },
    {
      field: 'createTime',
      align: 'center',
      title: '{common.table.createTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'createBy',
      align: 'left',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      align: 'center',
      title: '{common.table.updateTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      align: 'left',
      title: '{common.table.updateUser}',
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

/**
 * 添加修改表单
 */
export const getParameterTenantFormSchemas = (): FormSchema[] => {
  return [
    {
      fieldName: 'id',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'isAdd',
      label: '',
      component: 'Switch',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'parameterId',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'parameter',
      label: t('system.views.parameter.title.parameter'),
      component: 'Textarea',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'commonYn',
      label: t('system.views.parameter.title.commonYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: false,
      dependencies: {
        triggerFields: ['isAdd'],
        show: (value) => {
          return value.isAdd === true;
        },
      },
    },
  ];
};
