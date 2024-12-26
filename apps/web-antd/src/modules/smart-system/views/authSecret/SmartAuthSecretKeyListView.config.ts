import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';

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
    },
    {
      field: 'id',
      visible: false,
      title: 'ID',
      width: 120,
    },
    {
      field: 'keyName',
      title: '{smart.auth.secret.title.keyName}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'fileStorageId',
      title: '{smart.auth.secret.title.fileStorageId}',
      width: 120,
      formatter: ({ row }) => {
        return row.fileStorage?.storageName;
      },
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      ...getTableUseYnColumnClass(),
      width: 100,
      sortable: true,
    },
    {
      field: 'alias',
      title: '{smart.auth.secret.title.alias}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
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
      label: 'ID',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'keyName',
      label: t('smart.auth.secret.title.keyName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'fileStorageId',
      label: t('system.views.file.title.fileStorageId'),
      component: 'SmartApiSelectTable',
      componentProps: {
        modelClassName: 'com.smart.file.manager.model.SmartFileStoragePO',
        valuefieldNameName: 'id',
        labelfieldNameName: 'storageName',
        params: {
          sortName: 'seq',
          parameter: {
            'deleteYn@<>': true,
            'useYn@=': true,
          },
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      rules: 'required',
      defaultValue: 1,
    },
    {
      fieldName: 'storePassword',
      label: t('smart.auth.secret.title.storePassword'),
      component: 'InputPassword',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'keyPassword',
      label: t('smart.auth.secret.title.keyPassword'),
      component: 'InputPassword',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'alias',
      label: t('smart.auth.secret.title.alias'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'publicKeyFileList',
      label: t('smart.auth.secret.title.publicKeyFile'),
      componentProps: {},
      slot: 'form-publicKeyFile',
      rules: 'required',
      component: 'Input',
    },
    {
      fieldName: 'privateKeyFileList',
      label: t('smart.auth.secret.title.privateKeyFile'),
      componentProps: {},
      slot: 'form-privateKeyFile',
      rules: 'required',
      component: 'Input',
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Input',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'keyName',
      label: t('smart.auth.secret.title.keyName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '120px',
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
