import type { VbenFormSchema } from '#/adapter/form';
import type { SmartTableColumn } from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';
import { formatDate } from '@vben/utils';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';

export const Permission = {
  add: 'sys:i18n:save',
  delete: 'sys:i18n:delete',
  update: 'sys:i18n:update',
  reload: 'sys:i18n:reload',
};

export const getI18nTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'platform',
      title: '{system.views.i18n.i18n.titlePlatform}',
      width: 120,
    },
    {
      field: 'i18nCode',
      title: '{system.views.i18n.i18n.titleI18nCode}',
      minWidth: 260,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'createTime',
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
      ...getTableUseYnColumnClass(),
      sortable: true,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'i18nId',
      title: '{common.table.operation}',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getI18nAddEditSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'groupId',
      component: 'Input',
      dependencies: {
        triggerFields: ['groupId'],
        show: false,
      },
    },
    {
      label: '',
      fieldName: 'i18nId',
      component: 'Input',
      dependencies: {
        triggerFields: ['i18nId'],
        show: false,
      },
    },
    {
      label: t('system.views.i18n.i18n.titlePlatform'),
      fieldName: 'platform',
      component: 'Select',
      rules: 'required',
      componentProps: {
        options: [
          {
            label: 'backstage',
            value: 'backstage',
          },
          {
            label: 'front',
            value: 'front',
          },
        ],
      },
    },
    {
      label: t('system.views.i18n.i18n.titleI18nCode'),
      fieldName: 'i18nCode',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('common.table.remark'),
      fieldName: 'remark',
      component: 'Textarea',
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'InputNumber',
      componentProps: {
        style: { width: '100%' },
      },
      rules: 'required',
    },
  ];
};

export const getI18nItemListTableColumn = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.i18n.i18nItem.titleLocale}',
      field: 'locale',
      width: 120,
    },
    {
      title: '{system.views.i18n.i18nItem.titleValue}',
      field: 'value',
      minWidth: 160,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      formatter: ({ cellValue }: any) => {
        if (cellValue) {
          formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss');
        }
        return '';
      },
    },
    {
      field: 'createUser',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'i18nItemId',
      title: '{common.table.operation}',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getI18nItemListAddEditFormSchema = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'i18nItemId',
      component: 'Input',
      dependencies: {
        triggerFields: ['i18nItemId'],
        show: false,
      },
    },
    {
      label: t('system.views.i18n.i18nItem.titleLocale'),
      fieldName: 'locale',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.i18n.i18nItem.titleValue'),
      fieldName: 'value',
      component: 'Textarea',
      rules: 'required',
    },
  ];
};
