import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { getTableUseYnColumnClass } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import dayjs from 'dayjs';

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
      field: 'seq',
      title: '{common.table.seq}',
      fixed: 'left',
      width: 120,
      sortable: true,
    },
    {
      field: 'code',
      title: '{system.views.serial.title.code}',
      fixed: 'left',
      width: 120,
    },
    {
      field: 'name',
      fixed: 'left',
      title: '{system.views.serial.title.name}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'serialFormat',
      title: '{system.views.serial.title.serialFormat}',
      width: 180,
    },
    {
      field: 'prefix',
      title: '{system.views.serial.title.prefix}',
      width: 120,
    },
    {
      field: 'dateFormat',
      title: '{system.views.serial.title.dateFormat}',
      width: 200,
    },
    {
      field: 'serialLength',
      title: '{system.views.serial.title.serialLength}',
      width: 120,
    },
    {
      field: 'minValue',
      title: '{system.views.serial.title.minValue}',
      width: 120,
    },
    {
      field: 'maxValue',
      title: '{system.views.serial.title.maxValue}',
      width: 120,
    },
    {
      field: 'stepValue',
      title: '{system.views.serial.title.stepValue}',
      width: 120,
    },
    {
      field: 'currentDate',
      title: '{system.views.serial.title.currentDate}',
      width: 120,
    },
    {
      field: 'currentValue',
      title: '{system.views.serial.title.currentValue}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      sortable: true,
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
      width: 160,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      ...getTableUseYnColumnClass(),
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
      label: '',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'code',
      label: t('system.views.serial.title.code'),
      component: 'Input',
      rules: 'required',
      componentProps: {},
    },
    {
      fieldName: 'name',
      label: t('system.views.serial.title.name'),
      component: 'Input',
      rules: 'required',
      componentProps: {},
    },
    {
      fieldName: 'serialFormat',
      label: t('system.views.serial.title.serialFormat'),
      component: 'Input',
      rules: 'required',
      defaultValue: '{PREFIX}{DATE}{NUMBER}',
      componentProps: {},
    },
    {
      fieldName: 'prefix',
      label: t('system.views.serial.title.prefix'),
      component: 'Input',
      rules: 'required',
      componentProps: {},
    },
    {
      fieldName: 'dateFormat',
      label: t('system.views.serial.title.dateFormat'),
      component: 'Input',
      rules: 'required',
      componentProps: {},
    },
    {
      fieldName: 'serialLength',
      label: t('system.views.serial.title.serialLength'),
      component: 'Input',
      rules: 'required',
      componentProps: {},
    },
    {
      fieldName: 'minValue',
      label: t('system.views.serial.title.minValue'),
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
      componentProps: {},
      controlClass: 'w-full',
    },
    {
      fieldName: 'maxValue',
      label: t('system.views.serial.title.maxValue'),
      component: 'InputNumber',
      rules: 'required',
      defaultValue: -1,
      componentProps: {},
      controlClass: 'w-full',
    },
    {
      fieldName: 'stepValue',
      label: t('system.views.serial.title.stepValue'),
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
      componentProps: {},
      controlClass: 'w-full',
    },
    {
      fieldName: '123',
      label: '',
      component: () => '',
      defaultValue: 1,
      componentProps: {},
      controlClass: 'w-full',
    },
    {
      fieldName: 'currentDate',
      label: t('system.views.serial.title.currentDate'),
      component: 'DatePicker',
      defaultValue: dayjs(),
      // defaultValue: new Date(),
      componentProps: {
        disabled: true,
        style: {
          width: '100%',
        },
      },
    },
    {
      fieldName: 'currentValue',
      label: t('system.views.serial.title.currentValue'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Switch',
      rules: 'required',
      defaultValue: true,
      componentProps: {},
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
      componentProps: {},
      controlClass: 'w-full',
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
      label: t('system.views.serial.title.code'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'name',
      label: t('system.views.serial.title.name'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};
