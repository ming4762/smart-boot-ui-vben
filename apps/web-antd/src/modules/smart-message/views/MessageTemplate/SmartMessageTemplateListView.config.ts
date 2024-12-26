import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

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
      title: '',
      width: 120,
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
      field: 'templateContent',
      title: '{smart.message.template.title.templateContent}',
      minWidth: 200,
    },
    {
      field: 'useYn',
      component: 'booleanTag',
      title: '{common.title.useYn}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
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
    // TODO:富文本组件未添加
    // {
    //   fieldName: 'templateContent',
    //   label: t('smart.message.template.title.templateContent'),
    //   slot: 'addEdit-templateContent',
    //   component: 'Input',
    //   componentProps: {
    //     height: 600,
    //     imageAction: `${requestClient.getApiUrlByService(
    //       ApiServiceEnum.SMART_FILE,
    //     )}/smart/file/upload`,
    //   },
    // },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Switch',
      defaultValue: true,
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'templateCode',
      label: t('smart.message.template.title.templateCode'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'templateName',
      label: t('smart.message.template.title.templateName'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};
