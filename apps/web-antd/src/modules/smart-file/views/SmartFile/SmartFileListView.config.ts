import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { listApi } from '../SmartFileStorage/SmartFileStorageListView.api';

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
      field: 'fileId',
      visible: false,
      title: '{smart.file.fileManager.title.fileId}',
      width: 120,
    },
    {
      field: 'fileStorageId',
      title: '{smart.file.fileManager.title.fileStorageId}',
      width: 160,
      fixed: 'left',
      formatter: ({ row }) => {
        return row.fileStorage?.storageName;
      },
      sortable: true,
    },
    {
      field: 'filename',
      title: '{smart.file.fileManager.title.fileName}',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'type',
      title: '{smart.file.fileManager.title.type}',
      width: 120,
      sortable: true,
    },
    {
      field: 'contentType',
      title: '{smart.file.fileManager.title.contentType}',
      width: 160,
    },
    {
      field: 'fileSize',
      title: '{smart.file.fileManager.title.fileSize}',
      width: 120,
      sortable: true,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      sortable: true,
      type: 'dateTime',
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
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
      fieldName: 'fileId',
      label: t('smart.file.fileManager.title.fileId'),
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['fileId'],
        show: false,
      },
    },
    {
      fieldName: 'fileStorageId',
      label: t('smart.file.fileManager.title.fileStorageId'),
      component: 'ApiSelect',
      controlClass: 'w-full',
      componentProps: {
        api: () =>
          listApi({
            sortName: 'seq',
            parameter: {
              'deleteYn@<>': true,
              'useYn@=': true,
            },
          }),
        labelField: 'storageName',
        valueField: 'id',
        autoSelect: (itemList: any[]) => {
          return itemList.find((item) => item.defaultStorage === true);
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'fileName',
      label: t('smart.file.fileManager.title.fileName'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'type',
      label: t('smart.file.fileManager.title.type'),
      component: 'ApiDictSelect',
      componentProps: {
        dictCode: 'FILE_TYPE',
      },
      controlClass: 'w-full',
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      defaultValue: 1,
      componentProps: {},
      rules: 'required',
      controlClass: 'w-full',
    },
    {
      fieldName: 'fileList',
      label: '文件',
      slot: 'form-upload',
      rules: 'required',
      component: 'Input',
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'fileName',
      label: t('smart.file.fileManager.title.fileName'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'type',
      label: t('smart.file.fileManager.title.type'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'fileStorageId',
      label: t('smart.file.fileManager.title.fileStorageId'),
      component: 'ApiSelect',
      componentProps: {
        style: {
          width: '150px',
        },
        api: () =>
          listApi({
            sortName: 'seq',
            parameter: {
              'deleteYn@<>': true,
              'useYn@=': true,
            },
          }),
        labelField: 'storageName',
        valueField: 'id',
      },
      searchSymbol: '=',
    },
  ];
};
