import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
  z,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { isJsonString } from '@vben/utils';
import {getUseYnSelectOptions} from '@smart/common/utils';

export enum Permissions {
  delete = 'sys:microApp:microFrontend:delete',
  save = 'sys:microApp:microFrontend:save',
  setUseYn = 'sys:microApp:microFrontend:setUseYn',
  update = 'sys:microApp:microFrontend:update',
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
      field: 'code',
      align: 'left',
      title: '{system.views.microFrontend.title.code}',
      width: 120,
    },
    {
      field: 'name',
      align: 'left',
      title: '{system.views.microFrontend.title.name}',
      width: 120,
    },
    {
      field: 'url',
      align: 'left',
      title: '{system.views.microFrontend.title.url}',
      width: 120,
    },
    {
      field: 'sync',
      ...getTableBooleanColumnClass('sync', false),
      sortable: true,
      align: 'center',
      title: '{system.views.microFrontend.title.sync}',
      width: 120,
    },
    {
      field: 'alive',
      ...getTableBooleanColumnClass('alive', false),
      sortable: true,
      align: 'center',
      title: '{system.views.microFrontend.title.alive}',
      width: 120,
    },
    {
      field: 'props',
      align: 'left',
      title: '{system.views.microFrontend.title.props}',
      width: 120,
    },
    {
      field: 'fiber',
      ...getTableBooleanColumnClass('fiber', false),
      sortable: true,
      align: 'center',
      title: '{system.views.microFrontend.title.fiber}',
      width: 120,
    },
    {
      field: 'degrade',
      ...getTableBooleanColumnClass('degrade', false),
      sortable: true,
      align: 'center',
      title: '{system.views.microFrontend.title.degrade}',
      width: 120,
    },
    {
      field: 'attrs',
      align: 'left',
      title: '{system.views.microFrontend.title.attrs}',
      width: 120,
    },
    {
      field: 'remark',
      align: 'left',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'seq',
      sortable: true,
      align: 'right',
      title: '{common.table.seq}',
      width: 120,
    },
    {
      field: 'useYn',
      sortable: true,
      align: 'left',
      ...getTableUseYnColumnClass(),
      width: 120,
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
export const getFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
      label: t('system.views.microFrontend.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'code',
      label: t('system.views.microFrontend.title.code'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: t('system.views.microFrontend.title.name'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'url',
      label: t('system.views.microFrontend.title.url'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      controlClass: 'w-full',
    },
    {
      fieldName: 'sync',
      label: t('system.views.microFrontend.title.sync'),
      component: 'Switch',
      componentProps: {},
      defaultValue: false,
    },
    {
      fieldName: 'alive',
      label: t('system.views.microFrontend.title.alive'),
      component: 'Switch',
      componentProps: {},
      defaultValue: false,
    },
    {
      fieldName: 'fiber',
      label: t('system.views.microFrontend.title.fiber'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
    {
      fieldName: 'degrade',
      label: t('system.views.microFrontend.title.degrade'),
      component: 'Switch',
      componentProps: {},
      defaultValue: false,
    },
    {
      fieldName: 'html',
      label: t('system.views.microFrontend.title.html'),
      component: 'Textarea',
      componentProps: {},
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'prefix',
      label: t('system.views.microFrontend.title.prefix'),
      component: 'Textarea',
      componentProps: {},
      hideRequiredMark: true,
      rules: z
        .string()
        .nullable()
        .default(null)
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: 'data必须为json字符串',
          },
        ),
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'props',
      label: t('system.views.microFrontend.title.props'),
      component: 'Textarea',
      componentProps: {},
      hideRequiredMark: true,
      rules: z
        .string()
        .nullable()
        .default(null)
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: 'data必须为json字符串',
          },
        ),
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'attrs',
      label: t('system.views.microFrontend.title.attrs'),
      component: 'Textarea',
      componentProps: {},
      hideRequiredMark: true,
      rules: z
        .string()
        .nullable()
        .default(null)
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: 'data必须为json字符串',
          },
        ),
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
      formItemClass: 'col-span-2',
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'code',
      label: t('system.views.microFrontend.title.code'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'name',
      label: t('system.views.microFrontend.title.name'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'useYn',
      label: t('common.table.useYn'),
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: getUseYnSelectOptions(),
        style: { width: '100px' },
      },
      searchSymbol: '=',
    },
  ];
};
