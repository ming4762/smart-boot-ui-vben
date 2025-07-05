import type { Ref } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';
import { getUseYnSelectOptions } from '#/utils';

export enum Permissions {
  delete = 'sys:i18n:delete',
  save = 'sys:i18n:save',
  setUseYn = 'sys:i18n:setUseYn',
  update = 'sys:i18n:update',
}

export const PLATFORM_DICT_KEY = 'SYSTEM_I18N_PLATFORM';

/**
 * 表格列表
 */
export const getTableColumns = (
  pageDictMap: Ref<any> | undefined,
): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'platform',
      sortable: true,
      align: 'left',
      title: '{system.views.i18n.json.head.title.platform}',
      width: 120,
      formatter: ({ row }) => {
        const { platform } = row;
        if (!pageDictMap || !unref(pageDictMap)[PLATFORM_DICT_KEY]) {
          return platform;
        }
        return unref(pageDictMap)[PLATFORM_DICT_KEY][platform] || platform;
      },
    },
    {
      field: 'name',
      align: 'left',
      title: '{system.views.i18n.json.head.title.name}',
      width: 160,
      sortable: true,
    },
    {
      field: 'remark',
      align: 'left',
      title: '{common.table.remark}',
      minWidth: 160,
    },
    {
      field: 'useYn',
      align: 'left',
      ...getTableUseYnColumnClass(),
      width: 120,
      sortable: true,
    },
    {
      field: 'seq',
      align: 'right',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      align: 'center',
      title: '{common.table.createTime}',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'createBy',
      align: 'left',
      title: '{common.table.createUser}',
      width: 120,
      sortable: true,
    },
    {
      field: 'updateTime',
      align: 'center',
      title: '{common.table.updateTime}',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      align: 'left',
      title: '{common.table.updateUser}',
      width: 120,
      sortable: true,
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
      fieldName: 'platform',
      label: t('system.views.i18n.json.head.title.platform'),
      component: 'ApiDictSelect',
      componentProps: {
        dictCode: PLATFORM_DICT_KEY,
      },
      controlClass: 'w-full',
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: t('system.views.i18n.json.head.title.name'),
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
      componentProps: {},
      controlClass: 'w-full',
      defaultValue: 1,
      rules: 'required',
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'platform',
      label: t('system.views.i18n.json.head.title.platform'),
      component: 'ApiDictSelect',
      controlClass: 'w-full',
      componentProps: {
        style: {
          width: '150px',
        },
        dictCode: PLATFORM_DICT_KEY,
      },
      searchSymbol: '=',
    },
    {
      fieldName: 'name',
      label: t('system.views.i18n.json.head.title.name'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'useYn',
      label: t('common.table.useYn'),
      componentProps: {
        options: getUseYnSelectOptions(),
      },
      component: 'Select',
      controlClass: 'w-full',
      searchSymbol: '=',
      defaultValue: 1,
    },
  ];
};
