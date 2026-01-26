import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { h } from 'vue';

import { getTableBooleanColumnClass, z } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';
import { isJsonString } from '@vben/utils';

import { listMicroFrontend } from './FunctionListView.api';

export const Permission = {
  add: 'sys:function:save',
  delete: 'sys:function:delete',
  update: 'sys:function:update',
  useYn: 'sys:function:setUseYn',
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
    title: '是否微前端',
    ...getTableBooleanColumnClass('isMicroFrontend', false),
    field: 'isMicroFrontend',
    width: 90,
    align: 'center',
    headerAlign: 'left',
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
    formatter: 'datetime',
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
    formatter: 'datetime',
  },
  {
    title: '{common.table.updateUser}',
    field: 'updateBy',
    width: 120,
  },
  {
    title: '{common.table.operation}',
    field: 'operation',
    width: 245,
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
          return z.string().min(1, {
            message: t('system.views.function.validate.componentName'),
          });
        },
      },
    },
    // 用来标识是否添加
    {
      fieldName: 'isAdd',
      label: '',
      component: 'Switch',
      dependencies: {
        triggerFields: ['isAdd'],
        show: false,
      },
    },
    {
      fieldName: 'component',
      label: t('system.views.function.table.component'),
      component: 'Input',
      dependencies: {
        triggerFields: ['functionType', 'isMicroFrontend'],
        show: (value) => {
          return value.functionType !== 'FUNCTION';
        },
        rules: (value) => {
          if (!(value.functionType === 'MENU')) {
            return null;
          }
          return z.string().min(1, {
            message: t('system.views.function.validate.component'),
          });
        },
        disabled: (value) => {
          return value.isMicroFrontend;
        },
        trigger: (value, formApi) => {
          if (!value.isAdd) {
            return;
          }
          const component = value.isMicroFrontend ? 'WujieVue' : '';
          formApi.setFieldValue('component', component);
        },
      },
    },
    {
      fieldName: 'url',
      label: 'URL',
      component: 'Input',
      dependencies: {
        triggerFields: ['functionType'],
        rules: (value) => {
          if (!(value.functionType === 'MENU')) {
            return null;
          }
          return z.string().min(1, {
            message: t('system.views.function.validate.url'),
          });
        },
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
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'FUNCTION';
        },
        rules: (value) => {
          if (!(value.functionType === 'FUNCTION')) {
            return null;
          }
          return z.string().min(1, {
            message: t('system.views.function.validate.permission'),
          });
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
      fieldName: 'isMicroFrontend',
      label: '是否微前端',
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType === 'MENU';
        },
        trigger: (value, formApi) => {
          if (value.functionType !== 'MENU') {
            formApi.setFieldValue('isMicroFrontend', false);
          }
        },
      },
    },
    {
      fieldName: 'internalOrExternal',
      label: t('system.views.function.table.internalOrExternal'),
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['functionType', 'isMicroFrontend'],
        show: (value) => {
          return value.functionType === 'MENU';
        },
        disabled: (value) => {
          return value.isMicroFrontend;
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
    {
      fieldName: 'meta',
      label: 'Meta',
      component: 'Textarea',
      componentProps: {
        rows: 3,
        placeholder: 'Json',
      },
      dependencies: {
        triggerFields: ['functionType'],
        show: (value) => {
          return value.functionType !== 'FUNCTION';
        },
      },
      formItemClass: 'col-span-2',
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: 'meta必须为json字符串',
          },
        ),
    },
    {
      fieldName: 'microFrontendId',
      label: '微应用',
      component: 'ApiSelect',
      controlClass: 'w-full',
      componentProps: {
        valueField: 'id',
        labelField: 'name',
        api: async () => {
          const dataList = await listMicroFrontend({});
          return dataList.map((item) => ({
            id: item.id,
            name: `${item.code}-${item.name}`,
          }));
        },
      },
      dependencies: {
        triggerFields: ['isMicroFrontend'],
        show: (value) => {
          return value.isMicroFrontend;
        },
        required: (value) => {
          return value.isMicroFrontend;
        },
      },
    },
    {
      fieldName: 'microFrontendUrl',
      label: '前端微页面地址',
      component: 'Input',
      defaultValue: '',
      dependencies: {
        triggerFields: ['isMicroFrontend'],
        show: (value) => {
          return value.isMicroFrontend;
        },
      },
    },
    {
      fieldName: 'multiInstanceYn',
      label: '是否多实例',
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['isMicroFrontend'],
        show: (value) => {
          return value.isMicroFrontend;
        },
      },
    },
    {
      fieldName: 'routeInclusionYn',
      label: '是否联动路由',
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['isMicroFrontend', 'multiInstanceYn'],
        show: (value) => {
          return value.isMicroFrontend;
        },
        disabled: (value) => {
          return value.multiInstanceYn;
        },
      },
    },
    {
      fieldName: 'microFrontendConfig',
      label: '前端微应用配置',
      component: 'SmartCodeEditor',
      componentProps: {
        language: 'json',
        lineNumbers: false,
      },
      formItemClass: 'col-span-2',
      defaultValue: '',
      dependencies: {
        triggerFields: ['isMicroFrontend'],
        show: (value) => {
          return value.isMicroFrontend;
        },
      },
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: '必须为json字符串',
          },
        ),
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
