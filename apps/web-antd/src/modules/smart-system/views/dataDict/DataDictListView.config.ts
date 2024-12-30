import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';

export const getDataDictGroupColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.dictGroup.title.dictCode}',
      field: 'dictCode',
      width: 180,
      // filters: [{ data: '' }],
      // slots: {
      //   filter: 'dictCode-filter',
      // },
      fixed: 'left',
    },
    {
      title: '{system.views.dictGroup.title.dictName}',
      field: 'dictName',
      minWidth: 180,
      // filters: [{ data: '' }],
      // slots: {
      //   filter: 'dictName-filter',
      // },
    },
    {
      title: '{system.views.dictGroup.title.tenant}',
      field: 'tenantId',
      width: 140,
      formatter: ({ row }) => {
        return row.tenant?.tenantShortName || row.tenant?.tenantName;
      },
    },
    {
      title: '{common.table.seq}',
      field: 'seq',
      sortable: true,
      width: 120,
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
      width: 120,
      // filterMultiple: false,
      // filters: [
      //   { label: 'YES', data: true },
      //   { label: 'NO', data: false },
      // ],
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      width: 120,
      // filters: [{ data: '' }],
      // slots: {
      //   filter: 'dictName-filter',
      // },
    },
  ];
};

export const getDataDictGroupSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.dictGroup.title.dictCode'),
      fieldName: 'dictCode',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '120px' },
      },
    },
    {
      label: t('system.views.dictGroup.title.dictName'),
      fieldName: 'dictName',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '120px' },
      },
    },
    {
      label: t('system.views.userGroup.search.useYnTitle'),
      fieldName: 'useYn',
      component: 'Select',
      defaultValue: 1,
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '80px',
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

export const getDataDictGroupAddEditSchemas = (
  getIsPlatformTenant: boolean,
): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      label: t('system.views.dictGroup.title.dictCode'),
      fieldName: 'dictCode',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.dictGroup.title.dictName'),
      fieldName: 'dictName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
      controlClass: 'w-full',
    },
    {
      label: t('common.title.useYn'),
      fieldName: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('common.table.remark'),
      fieldName: 'remark',
      component: 'Textarea',
    },
    {
      label: t('common.title.tenantCommonYn'),
      fieldName: 'tenantCommonYn',
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['tenantCommonYn'],
        show: unref(getIsPlatformTenant),
      },
    },
  ];
};

export const getDataDictItemColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'dictItemCode',
      fixed: 'left',
      title: '{system.views.dictItem.title.dictItemCode}',
      width: 160,
    },
    {
      field: 'dictItemName',
      title: '{system.views.dictItem.title.dictItemName}',
      width: 180,
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 100,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 180,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 170,
    },
  ];
};

export const getDataDictItemAddEditSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: 'id',
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      label: t('system.views.dictItem.title.dictItemCode'),
      fieldName: 'dictItemCode',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.dictItem.title.dictItemName'),
      fieldName: 'dictItemName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
      controlClass: 'w-full',
    },
    {
      label: t('common.title.useYn'),
      fieldName: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('common.table.remark'),
      fieldName: 'remark',
      component: 'Textarea',
    },
  ];
};
