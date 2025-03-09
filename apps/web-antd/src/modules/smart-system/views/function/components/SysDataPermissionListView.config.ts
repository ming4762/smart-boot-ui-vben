import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';

const DATA_SCOPE = [
  {
    label: t('system.views.dataPermission.title.permissionScope.ALL'),
    value: 'DATA_ALL',
  },
  {
    label: t('system.views.dataPermission.title.permissionScope.DATA_DEPT'),
    value: 'DATA_DEPT',
  },
  {
    label: t(
      'system.views.dataPermission.title.permissionScope.DATA_DEPT_AND_CHILD',
    ),
    value: 'DATA_DEPT_AND_CHILD',
  },
  {
    label: t('system.views.dataPermission.title.permissionScope.DATA_PERSONAL'),
    value: 'DATA_PERSONAL',
  },
  {
    label: t('system.views.dataPermission.title.permissionScope.DATA_CUSTOM'),
    value: 'DATA_CUSTOM',
  },
];

/**
 * 表格列表
 */
export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 40,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'permissionCode',
      align: 'left',
      title: '{system.views.dataPermission.title.permissionCode}',
      width: 100,
    },
    {
      field: 'permissionName',
      align: 'left',
      title: '{system.views.dataPermission.title.permissionName}',
      width: 100,
    },
    {
      field: 'scope',
      align: 'left',
      title: '{system.views.dataPermission.title.scope}',
      width: 100,
    },
    {
      field: 'permissionColumn',
      align: 'left',
      title: '{system.views.dataPermission.title.permissionColumn}',
      width: 80,
    },
    {
      field: 'permissionValue',
      align: 'left',
      title: '{system.views.dataPermission.title.permissionValue}',
      width: 120,
      visible: false,
    },
    {
      field: 'tableName',
      align: 'left',
      title: '{system.views.dataPermission.title.tableName}',
      width: 80,
    },
    {
      field: 'mapperStatementId',
      align: 'left',
      title: '{system.views.dataPermission.title.mapperStatementId}',
      minWidth: 120,
    },
    {
      field: 'remark',
      align: 'left',
      title: '{common.table.remark}',
      width: 120,
      visible: false,
    },
    {
      field: 'useYn',
      align: 'left',
      ...getTableUseYnColumnClass(),
      width: 120,
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
      label: '',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'permissionCode',
      label: t('system.views.dataPermission.title.permissionCode'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'permissionName',
      label: t('system.views.dataPermission.title.permissionName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'scope',
      label: t('system.views.dataPermission.title.scope'),
      component: 'Select',
      controlClass: 'w-full',
      componentProps: {
        options: DATA_SCOPE,
      },
      rules: 'required',
    },
    {
      fieldName: 'permissionColumn',
      label: t('system.views.dataPermission.title.permissionColumn'),
      component: 'Input',
      componentProps: {
        placeholder: t('system.views.dataPermission.validate.permissionColumn'),
      },
    },
    {
      fieldName: 'tableName',
      label: t('system.views.dataPermission.title.tableName'),
      component: 'Input',
      componentProps: {
        placeholder: t('system.views.dataPermission.validate.tableName'),
      },
    },
    {
      fieldName: 'mapperStatementId',
      label: t('system.views.dataPermission.title.mapperStatementId'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'permissionValue',
      label: t('system.views.dataPermission.title.permissionValue'),
      component: 'Textarea',
      componentProps: {
        placeholder: t('system.views.dataPermission.validate.permissionValue'),
      },
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'permissionCode',
      label: t('system.views.dataPermission.title.permissionCode'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'permissionName',
      label: t('system.views.dataPermission.title.permissionName'),
      component: 'Input',
      searchSymbol: '=',
    },
    // {
    //   fieldName: 'scope',
    //   label: t('system.views.dataPermission.title.scope'),
    //   component: 'Input',
    //   searchSymbol: '=',
    // },
  ];
};
