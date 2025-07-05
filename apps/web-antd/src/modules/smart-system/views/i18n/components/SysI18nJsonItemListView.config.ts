import type { VbenFormSchema } from '#/adapter/form';
import type { SmartTableColumn } from '#/adapter/smart-table';

import { SUPPORT_LANGUAGES } from '@vben/constants';
import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';

export enum Permissions {
  delete = 'sys:i18n:delete',
  save = 'sys:i18n:save',
  setUseYn = 'sys:i18n:setUseYn',
  update = 'sys:i18n:update',
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
      field: 'locale',
      sortable: true,
      align: 'left',
      title: '{system.views.i18n.json.head.title.locale}',
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
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'headId',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'locale',
      label: t('system.views.i18n.json.head.title.locale'),
      component: 'Select',
      componentProps: {
        options: SUPPORT_LANGUAGES,
      },
      controlClass: 'w-full',
      rules: 'required',
    },
    {
      fieldName: 'data',
      label: t('system.views.i18n.json.head.title.data'),
      component: 'CodeEditor',
      componentProps: {
        language: 'json',
        class: 'h-full',
      },
      wrapperClass: 'h-full',
      formItemClass: 'items-start grow overflow-auto shrink',
    },
  ];
};
