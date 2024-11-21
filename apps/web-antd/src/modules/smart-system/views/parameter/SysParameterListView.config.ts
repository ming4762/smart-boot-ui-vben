import type {
  VbenFormSchema as FormSchema,
  SmartSearchFormSchema,
  SmartTableColumn,
} from '@vben/common-ui';

export enum Permissions {
  delete = 'sys:parameter:delete',
  query = 'sys:parameter:query',
  save = 'sys:parameter:save',
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
      field: 'parameter',
      title: '{system.views.parameter.title.parameter}',
      minWidth: 200,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'buildIn',
      sortable: true,
      title: '{system.views.parameter.title.buildIn}',
      width: 120,
      component: 'booleanTag',
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
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'useYn',
      sortable: true,
      title: '{common.table.useYn}',
      component: 'booleanTag',
      width: 120,
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
      fieldName: 'code',
      label: t('system.views.parameter.title.code'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: t('system.views.parameter.title.name'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'parameter',
      label: t('system.views.parameter.title.parameter'),
      component: 'Textarea',
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
      label: t('common.table.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
  ];
};

export const getSearchFormSchemas = (
  t: (key: string, ...args: any[]) => string,
): SmartSearchFormSchema[] => {
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
      label: t('common.table.useYn'),
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
  ];
};
