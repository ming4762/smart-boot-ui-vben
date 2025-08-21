import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { extensionLanguageMap } from '../../constants/Constants';
import { TemplateType as templateTypeConstants } from '../../constants/DatabaseConstants';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      fixed: 'left',
    },
    {
      field: 'name',
      title: '{smart.code.views.template.table.name}',
      width: 200,
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'templateType',
      title: '{smart.code.views.template.table.templateType}',
      width: 140,
      formatter: ({ row }: any) => {
        const templateType = templateTypeConstants[row.templateType];
        if (templateType) {
          return t(templateType.label);
        }
        return '';
      },
    },
    {
      field: 'language',
      title: '{smart.code.views.template.table.language}',
      width: 200,
    },
    {
      field: 'remark',
      title: '{smart.code.views.template.table.remark}',
      minWidth: 200,
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      title: '{common.table.createUser}',
      field: 'createBy',
      width: 120,
    },
    {
      title: '{common.table.updateTime}',
      field: 'updateTime',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
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

export const getSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      label: t('smart.code.views.template.table.name'),
      fieldName: 'name',
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};

export const getAddEditFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'templateId',
      component: 'Input',
      dependencies: {
        triggerFields: ['templateId'],
        show: false,
      },
    },
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
      label: t('smart.code.views.template.table.templateType'),
      fieldName: 'templateType',
      component: 'Select',
      rules: 'required',
      controlClass: 'w-full',
      componentProps: {
        options: Object.keys(templateTypeConstants).map((item) => {
          const value = templateTypeConstants[item];
          return {
            value: value.value,
            label: t(value.label),
          };
        }),
      },
    },
    {
      label: t('smart.code.views.template.table.name'),
      fieldName: 'name',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('smart.code.views.template.table.remark'),
      fieldName: 'remark',
      component: 'Input',
    },
    {
      label: t('smart.code.views.template.table.filenameSuffix'),
      fieldName: 'filenameSuffix',
      component: 'Input',
    },
    {
      label: t('smart.code.views.template.table.language'),
      fieldName: 'language',
      component: 'Select',
      controlClass: 'w-full',
      componentProps: {
        options: Object.keys(extensionLanguageMap).map((item) => {
          return {
            label: extensionLanguageMap[item],
            value: item,
          };
        }),
      },
    },
    {
      label: '',
      fieldName: 'template',
      labelWidth: 0,
      component: 'SmartCodeEditor',
      componentProps: {
        language: 'java',
      },
      formItemClass: 'col-span-3',
    },
  ];
};
