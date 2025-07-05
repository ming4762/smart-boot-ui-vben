import type { SmartSearchFormSchema, SmartTableColumn } from '@vben/common-ui';

import type { VbenFormSchema } from '#/adapter/form';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'categoryCode',
      title: '{system.views.category.title.categoryCode}',
      minWidth: 240,
      fixed: 'left',
      treeNode: true,
    },
    {
      field: 'categoryName',
      title: '{system.views.category.title.categoryName}',
      width: 200,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 170,
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
      width: 170,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'id',
      title: '{common.table.operation}',
      fixed: 'right',
      width: 200,
      slots: {
        default: 'table-option',
      },
    },
  ];
};

export const getFormSchemas = (
  getIsPlatformTenant: boolean,
): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      label: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'parentId',
      label: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['parentId'],
        show: false,
      },
    },
    {
      fieldName: 'parentName',
      label: t('system.views.category.title.parentName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'categoryCode',
      label: t('system.views.category.title.categoryCode'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'categoryName',
      label: t('system.views.category.title.categoryName'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {
        style: 'width: 100%',
      },
      rules: 'required',
      defaultValue: 1,
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
    },
    {
      label: t('common.title.tenantCommonYn'),
      fieldName: 'tenantCommonYn',
      component: 'Switch',
      defaultValue: false,
      dependencies: {
        triggerFields: ['parentId'],
        show: unref(getIsPlatformTenant),
        disabled: (value) => {
          return value.parentId !== 0;
        },
      },
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'categoryCode',
      label: t('system.views.category.title.categoryCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'categoryCode',
      label: t('system.views.category.title.categoryName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};
