import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { getTableBooleanColumnClass, z } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { isJsonString } from '@vben/utils';

import { getUseYnSelectOptions } from '@smart/common/utils';

export enum Permissions {
  delete = 'smart:message:template:delete',
  save = 'smart:message:template:save',
  update = 'smart:message:template:update',
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
    },
    {
      field: 'templateCode',
      title: '{smart.message.template.title.templateCode}',
      fixed: 'left',
      width: 120,
    },
    {
      field: 'templateName',
      title: '{smart.message.template.title.templateName}',
      fixed: 'left',
      width: 120,
    },
    {
      field: 'useYn',
      ...getTableBooleanColumnClass('useYn'),
      title: '{common.title.useYn}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
      formatter: 'datetime',
      sortable: true,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 165,
      formatter: 'datetime',
      sortable: true,
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
      label: '',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'templateCode',
      label: t('smart.message.template.title.templateCode'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'templateName',
      label: t('smart.message.template.title.templateName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'templateContent',
      label: t('smart.message.template.title.templateContent'),
      component: 'SmartTinymceEditor',
      componentProps: {
        height: 600,
      },
    },
    {
      fieldName: 'extraData',
      label: t('Extra'),
      component: 'SmartCodeEditor',
      componentProps: {
        language: 'json',
        class: 'h-[100px]',
        isLint: true,
      },
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value) {
              return true;
            }
            return isJsonString(value);
          },
          {
            message: '必须为json字符串',
          },
        ),
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'templateCode',
      label: t('smart.message.template.title.templateCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'templateName',
      label: t('smart.message.template.title.templateName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Select',
      componentProps: {
        options: getUseYnSelectOptions(),
        class: 'w-[100px]',
      },
      defaultValue: 1,
      searchSymbol: '=',
    },
  ];
};
