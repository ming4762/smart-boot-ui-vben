import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { h } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { z } from '#/adapter/form';
import { $t as t } from '#/locales';

export const Permission = {
  add: 'sys:function:save',
  delete: 'sys:function:delete',
  update: 'sys:function:update',
};

export const tableColumns: SmartTableColumn[] = [
  {
    type: 'checkbox',
    width: 60,
    align: 'center',
    fixed: 'left',
  },
  {
    title: '{system.views.function.table.functionName}',
    field: 'functionName',
    width: 220,
    fixed: 'left',
    treeNode: true,
  },
  {
    title: '{system.views.function.table.functionType}',
    field: 'functionType',
    width: 110,
    align: 'center',
    headerAlign: 'left',
    slots: {
      default: 'table-functionType',
    },
  },
  {
    title: '{system.views.function.table.icon}',
    field: 'icon',
    width: 80,
    align: 'center',
    headerAlign: 'left',
    slots: {
      default: ({ row }) => {
        if (!row.icon) {
          return '';
        }
        return h(createIconifyIcon(row.icon));
      },
    },
  },
  {
    title: 'URL',
    field: 'url',
    minWidth: 200,
  },
  {
    title: '{system.views.function.table.permission}',
    field: 'permission',
    width: 160,
  },
  {
    title: '{system.views.function.table.httpMethod}',
    field: 'httpMethod',
    width: 120,
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
    width: 200,
    fixed: 'right',
    slots: {
      default: 'table-operation',
    },
  },
];

export const getAddEditForm = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'functionId',
      label: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['functionId'],
        show: false,
      },
    },
    {
      fieldName: 'isTopAdd',
      label: '',
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['functionId'],
        show: false,
      },
    },
    {
      fieldName: 'parentId',
      label: '上级',
      component: 'InputPassword',
      controlClass: 'w-full',
      slot: 'addEdit-parentId',
      dependencies: {
        triggerFields: ['functionId', 'functionType'],
      },
    },
    {
      fieldName: 'functionName',
      label: t('system.views.function.table.functionName'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'functionType',
      component: 'Input',
      label: t('system.views.function.table.functionType'),
      rules: 'required',
      slot: 'addEditForm-functionType',
    },
    {
      fieldName: 'i18nCode',
      label: t('system.views.function.table.i18nCode'),
      component: 'Input',
    },
    {
      fieldName: 'icon',
      label: t('system.views.function.table.icon'),
      component: 'IconPicker',
    },
    {
      fieldName: 'seq',
      rules: 'required',
      label: t('common.table.seq'),
      component: 'InputNumber',
      defaultValue: 1,
      controlClass: 'w-full',
    },
    {
      fieldName: 'componentName',
      label: t('system.views.function.table.componentName'),
      component: 'Input',
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType !== 'FUNCTION';
        },
        rules: (value) => {
          if (!(value.functionType === 'MENU')) {
            return null;
          }
          return z.string({
            message: t('system.views.function.validate.componentName'),
          });
        },
      },
    },
    {
      fieldName: 'component',
      label: t('system.views.function.table.component'),
      component: 'Input',
      dynamicRules: ({ model }) => {
        return [
          {
            required: model.functionType === 'MENU',
            trigger: 'blur',
            message: t('system.views.function.validate.component'),
          },
        ];
      },
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType !== 'FUNCTION';
        },
      },
    },
    {
      fieldName: 'url',
      label: 'URL',
      component: 'Input',
      dynamicRules: ({ model }) => {
        return [
          {
            required: model.functionType === 'MENU',
            trigger: 'blur',
            message: t('system.views.function.validate.url'),
          },
        ];
      },
    },
    {
      fieldName: 'redirect',
      label: 'Redirect',
      component: 'Input',
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType !== 'FUNCTION';
        },
      },
    },
    {
      fieldName: 'httpMethod',
      label: t('system.views.function.table.httpMethod'),
      component: 'Select',
      componentProps: {
        options: ['GET', 'POST', 'PUT', 'DELETE'].map((item) => ({
          label: item,
          value: item,
        })),
      },
      controlClass: 'w-full',
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'FUNCTION';
        },
      },
    },
    {
      fieldName: 'permission',
      label: t('system.views.function.table.permission'),
      component: 'Input',
      dynamicRules: ({ model }) => {
        return [
          {
            required: model.functionType === 'FUNCTION',
            message: t('system.views.function.validate.permission'),
            trigger: 'blur',
          },
        ];
      },
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'FUNCTION';
        },
      },
    },
    {
      fieldName: 'isMenu',
      label: t('system.views.function.table.menuIs'),
      component: 'Switch',
      defaultValue: true,
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType !== 'FUNCTION';
        },
      },
    },
    {
      fieldName: 'internalOrExternal',
      label: t('system.views.function.table.internalOrExternal'),
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'MENU';
        },
      },
    },
    {
      fieldName: 'dataRule',
      label: t('system.views.function.table.dataRule'),
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'FUNCTION';
        },
      },
    },
    {
      fieldName: 'cached',
      label: t('system.views.function.title.cached'),
      component: 'Switch',
      defaultValue: true,
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'MENU';
        },
      },
    },
  ];
};

export const getSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
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
