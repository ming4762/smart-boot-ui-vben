import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { type VbenFormSchema, z } from '#/adapter/form';

const dbTypeList = ['MYSQL', 'SQL_SERVER', 'ORACLE'];

export const tableColumns: SmartTableColumn[] = [
  {
    type: 'checkbox',
    width: 60,
    align: 'center',
    fixed: 'left',
  },
  {
    title: '{smart.code.views.database.table.connectionName}',
    field: 'connectionName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '{smart.code.views.database.table.databaseName}',
    field: 'databaseName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '{smart.code.views.database.table.type}',
    field: 'type',
    width: 120,
  },
  {
    title: '{smart.code.views.database.table.url}',
    field: 'url',
    minWidth: 200,
    showOverflow: 'tooltip',
  },
  {
    title: '{smart.code.views.database.table.username}',
    field: 'username',
    width: 120,
  },
  {
    title: '{smart.code.views.database.table.tableSchema}',
    field: 'tableSchema',
    width: 120,
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

export const addEditForm = (): Array<VbenFormSchema> => {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'systemId',
      component: 'Input',
      dependencies: {
        triggerFields: ['systemId'],
        show: false,
      },
    },
    {
      label: t('smart.code.views.database.table.connectionName'),
      fieldName: 'connectionName',
      component: 'Input',
      componentProps: {
        placeholder: t('smart.code.views.database.validate.connectionName'),
      },
      rules: 'required',
    },
    {
      label: t('smart.code.views.database.table.databaseName'),
      fieldName: 'databaseName',
      component: 'Input',
      componentProps: {
        placeholder: t('smart.code.views.database.validate.databaseName'),
      },
      rules: 'required',
    },
    {
      label: t('smart.code.views.database.table.type'),
      fieldName: 'type',
      component: 'Select',
      componentProps: {
        placeholder: t('smart.code.views.database.validate.type'),
        options: dbTypeList.map((item) => {
          return {
            label: item,
            value: item,
          };
        }),
      },
      controlClass: 'w-full',
      rules: z.string().min(1, t('smart.code.views.database.validate.type')),
    },
    {
      label: t('smart.code.views.database.table.url'),
      fieldName: 'url',
      component: 'Textarea',
      componentProps: {
        placeholder: t('smart.code.views.database.validate.url'),
        rows: 4,
      },
      rules: 'required',
    },
    {
      label: t('smart.code.views.database.table.username'),
      fieldName: 'username',
      component: 'Input',
      componentProps: {
        placeholder: t('smart.code.views.database.validate.username'),
      },
      rules: 'required',
    },
    {
      label: t('smart.code.views.database.table.password'),
      fieldName: 'password',
      component: 'InputPassword',
      componentProps: {
        placeholder: t('smart.code.views.database.validate.password'),
      },
      rules: 'required',
    },
    {
      label: t('smart.code.views.database.table.tableSchema'),
      fieldName: 'tableSchema',
      component: 'Input',
      componentProps: {},
    },
  ];
};

/**
 * 搜索表单配置
 */
export const searchForm = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'connectionName',
      component: 'Input',
      componentProps: {
        placeholder: t('smart.code.views.database.table.connectionName'),
      },
      searchSymbol: 'likeRight',
      label: '',
    },
    {
      fieldName: 'databaseName',
      component: 'Input',
      componentProps: {
        placeholder: t('smart.code.views.database.table.databaseName'),
      },
      searchSymbol: '=',
      label: '',
    },
    {
      fieldName: 'project',
      component: 'Input',
      componentProps: {
        placeholder: t('smart.code.views.database.table.project'),
      },
      searchSymbol: 'likeLeft',
      label: '',
    },
  ];
};
