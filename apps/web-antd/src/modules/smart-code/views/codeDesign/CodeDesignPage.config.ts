import type { VbenFormSchema } from '#/adapter/form';
import type { SmartTableColumn } from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { CONTROL_LIST, SEARCH_SYMBOL_LIST } from './constants';

type ButtonType =
  | 'ADD'
  | 'COLUMN_SETTING'
  | 'DELETE'
  | 'EDIT'
  | 'EXCEL_EXPORT'
  | 'EXCEL_IMPORT'
  | 'PRINT'
  | 'REFRESH'
  | 'RESET'
  | 'SEARCH'
  | 'SHOW_SEARCH'
  | 'USE_YN_FALSE'
  | 'USE_YN_TRUE'
  | 'ZOOM';

interface Button {
  key: ButtonType;
  value: string;
}

const tableTypeList = [
  {
    label: 'smart.code.views.codeManager.title.tableType.single',
    value: '10',
  },
  {
    label: 'smart.code.views.codeManager.title.tableType.main',
    value: '20',
  },
  {
    label: 'smart.code.views.codeManager.title.tableType.addendum',
    value: '30',
  },
];

const yesNoList = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

/**
 * 左侧按钮列表
 */
const letButtonList: Button[] = [
  {
    key: 'SEARCH',
    value: '搜索',
  },
  {
    key: 'RESET',
    value: '重置',
  },
  {
    key: 'ADD',
    value: '添加',
  },
  {
    key: 'EDIT',
    value: '修改',
  },
  {
    key: 'DELETE',
    value: '删除',
  },
  {
    key: 'USE_YN_TRUE',
    value: '启用',
  },
  {
    key: 'USE_YN_FALSE',
    value: '停用',
  },
];

const rightButtonList: Button[] = [
  {
    key: 'EXCEL_IMPORT',
    value: 'Excel导入',
  },
  {
    key: 'EXCEL_EXPORT',
    value: 'Excel导出',
  },
  {
    key: 'COLUMN_SETTING',
    value: '列配置',
  },
  {
    key: 'ZOOM',
    value: '放大缩小',
  },
  {
    key: 'REFRESH',
    value: '刷新',
  },
  {
    key: 'SHOW_SEARCH',
    value: '显示搜索',
  },
  {
    key: 'PRINT',
    value: '打印',
  },
];

/**
 * 行按钮
 */
const rowButtonList = [
  {
    key: 'EDIT',
    value: '修改',
  },
  {
    key: 'DELETE',
    value: '删除',
  },
];

const rowButtonTypeList = () => [
  {
    label: t('smart.code.views.codeManager.title.rowButtonType.none'),
    value: 'NONE',
  },
  {
    label: t('smart.code.views.codeManager.title.rowButtonType.single'),
    value: 'SINGLE',
  },
  {
    label: t('smart.code.views.codeManager.title.rowButtonType.more'),
    value: 'MORE',
  },
  {
    label: t('smart.code.views.codeManager.title.rowButtonType.text'),
    value: 'TEXT',
  },
];

const columnNumList = (hasZeroColumn = true) => {
  const column = [
    {
      value: 1,
      label: t('smart.code.views.codeManager.title.colNum.one'),
    },
    {
      value: 2,
      label: t('smart.code.views.codeManager.title.colNum.two'),
    },
    {
      value: 3,
      label: t('smart.code.views.codeManager.title.colNum.three'),
    },
    {
      value: 4,
      label: t('smart.code.views.codeManager.title.colNum.four'),
    },
  ];
  if (hasZeroColumn) {
    return [
      {
        value: 0,
        label: t('smart.code.views.design.title.colNum.zero'),
      },
      ...column,
    ];
  }
  return column;
};

export const formSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'systemId',
      component: 'Input',
      dependencies: {
        triggerFields: ['systemId'],
        show: false,
      },
    },
    {
      label: t('smart.code.views.codeManager.table.connectionName'),
      fieldName: 'connectionId',
      slot: 'addEditForm-connectionId',
      rules: 'required',
      component: 'Input',
      controlClass: 'w-full',
    },
    {
      label: t('smart.code.views.codeManager.table.tableName'),
      fieldName: 'tableName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('smart.code.views.codeManager.table.configName'),
      fieldName: 'configName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('smart.code.views.codeManager.table.type'),
      fieldName: 'type',
      component: 'Select',
      defaultValue: '10',
      controlClass: 'w-full',
      componentProps: {
        options: tableTypeList.map((item) => ({
          label: t(item.label),
          value: item.value,
        })),
      },
    },
    // ------------ 第二行 ---------------------
    {
      label: t('smart.code.views.codeManager.title.showCheckBox'),
      fieldName: 'showCheckbox',
      component: 'RadioGroup',
      defaultValue: true,
      componentProps: {
        options: yesNoList,
      },
    },
    {
      label: t('smart.code.views.codeManager.title.isPage'),
      fieldName: 'page',
      component: 'RadioGroup',
      defaultValue: true,
      componentProps: {
        options: yesNoList,
      },
    },
    {
      label: t('smart.code.views.codeManager.title.invented'),
      fieldName: 'invented',
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: yesNoList,
      },
    },
    {
      label: t('smart.code.views.codeManager.title.columnSort'),
      fieldName: 'columnSort',
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: yesNoList,
      },
    },
    // ------------ 第三行 ---------------------
    {
      label: t('smart.code.views.codeManager.title.leftButton'),
      fieldName: 'leftButtonList',
      component: 'Select',
      defaultValue: ['ADD', 'DELETE'],
      controlClass: 'w-full',
      componentProps: {
        mode: 'multiple',
        options: letButtonList.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      },
    },
    {
      label: t('smart.code.views.codeManager.title.rightButton'),
      fieldName: 'rightButtonList',
      component: 'Select',
      defaultValue: ['ZOOM', 'REFRESH', 'SHOW_SEARCH', 'COLUMN_SETTING'],
      controlClass: 'w-full',
      componentProps: {
        mode: 'multiple',
        options: rightButtonList.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      },
    },
    {
      label: t('smart.code.views.codeManager.title.rowButtonType.title'),
      fieldName: 'rowButtonType',
      component: 'Select',
      controlClass: 'w-full',
      defaultValue: 'NONE',
      componentProps: {
        options: rowButtonTypeList(),
      },
    },
    {
      label: t('smart.code.views.codeManager.title.rowButtonList'),
      fieldName: 'rowButtonList',
      component: 'Select',
      controlClass: 'w-full',
      componentProps: {
        mode: 'multiple',
        options: rowButtonList.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      },
    },
    // ------------ 第四行 ---------------------
    {
      label: t('smart.code.views.codeManager.title.formColNum'),
      fieldName: 'formColNum',
      component: 'Select',
      controlClass: 'w-full',
      defaultValue: 1,
      componentProps: {
        options: columnNumList(false),
      },
    },
    {
      label: t('smart.code.views.codeManager.title.searchColNum'),
      fieldName: 'searchColNum',
      component: 'Select',
      defaultValue: 0,
      controlClass: 'w-full',
      componentProps: {
        options: columnNumList(),
      },
    },
    {
      label: t('common.table.remark'),
      fieldName: 'remark',
      component: 'Input',
    },
    {
      label: t('smart.code.views.codeManager.title.i18nPrefix'),
      fieldName: 'i18nPrefix',
      component: 'Input',
      rules: 'required',
    },
    // ------------ 第五行 ---------------------
    {
      label: '权限前缀',
      fieldName: 'permissionPrefix',
      component: 'Input',
    },
    {
      label: t('smart.code.views.codeManager.title.relateTable'),
      fieldName: 'addendumTableList',
      defaultValue: [],
      slot: 'addEditForm-RelateTable',
      component: 'Input',
    },
    {
      label: '',
      fieldName: 'id',
      slot: 'addEditForm-syncTable',
      component: 'Input',
    },
  ];
};

/**
 * 获取table column
 */
export const getTableFiledColumns = (): SmartTableColumn[] => {
  return [
    {
      field: 'columnName',
      title: '{smart.code.views.tableField.title.columnName}',
      width: 160,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'typeName',
      title: '{smart.code.views.tableField.title.typeName}',
      width: 120,
    },
    {
      field: 'columnSize',
      title: '{smart.code.views.tableField.title.columnSize}',
      width: 120,
    },
    {
      field: 'decimalDigits',
      title: '{smart.code.views.tableField.title.decimalDigits}',
      width: 120,
    },
    {
      field: 'columnDef',
      title: '{smart.code.views.tableField.title.columnDef}',
      width: 120,
    },
    {
      field: 'nullable',
      title: '{smart.code.views.tableField.title.nullable}',
      width: 120,
      autoClass: 'Boolean',
      formatter({ row }) {
        const value = row.nullable;
        if (value === 0) {
          return '否';
        }
        return '是';
      },
    },
    {
      field: 'remarks',
      title: '{smart.code.views.tableField.title.remarks}',
      minWidth: 120,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'primaryKey',
      title: '{smart.code.views.tableField.title.primaryKey}',
      width: 120,
      autoClass: 'Boolean',
      formatter({ row }) {
        const value = row.primaryKey;
        if (value) {
          return '是';
        }
        return '';
      },
    },
    {
      field: 'indexed',
      title: '{smart.code.views.tableField.title.indexed}',
      width: 120,
      autoClass: 'Boolean',
      formatter({ row }) {
        const value = row.indexed;
        if (value) {
          return '是';
        }
        return '';
      },
    },
  ];
};

export const getPageSearchSettingColumn = (): SmartTableColumn[] => {
  const controlFormatMap: Record<string, any> = {};
  const controlFormatList = CONTROL_LIST.map(({ key, value }) => {
    const label = t(value);
    controlFormatMap[key] = label;
    return {
      label,
      value: key,
    };
  });

  return [
    {
      title: '{smart.code.views.tableField.title.columnName}',
      field: 'columnName',
      width: 160,
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '{smart.code.views.tableSetting.title.title}',
      field: 'title',
      width: 160,
      align: 'left',
      headerAlign: 'center',
      editRender: {
        name: 'AInput',
        autofocus: true,
      },
    },
    {
      title: '{smart.code.views.formSetting.title.controlType}',
      field: 'controlType',
      width: 150,
      editRender: {
        name: 'ASelect',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !row.visible,
            options: controlFormatList,
          };
        },
      },
      formatter({ row }) {
        const value = row.controlType;
        if (!value) {
          return '';
        }
        return controlFormatMap[value];
      },
    },
    {
      title: '{smart.code.views.formSetting.title.readonly}',
      field: 'readonly',
      width: 110,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.readonly;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{smart.code.views.tableSetting.title.visible}',
      field: 'visible',
      width: 110,
      editRender: {
        name: 'ASwitch',
      },
      formatter({ row }) {
        const value = row.visible;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{smart.code.views.tableSetting.title.hidden}',
      field: 'hidden',
      width: 110,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.hidden;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{smart.code.views.formSetting.title.used}',
      field: 'used',
      width: 120,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.used;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{smart.code.views.searchSetting.title.searchSymbol}',
      field: 'searchSymbol',
      width: 120,
      editRender: {
        name: 'ASelect',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !row.visible,
            options: SEARCH_SYMBOL_LIST.map((item) => {
              return {
                label: item,
                value: item,
              };
            }),
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.useTableSearch}',
      field: 'useTableSearch',
      width: 110,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.useTableSearch;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{smart.code.views.codeManager.table.tableName}',
      field: 'tableName',
      width: 120,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.keyColumnName}',
      field: 'keyColumnName',
      width: 120,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.valueColumnName}',
      field: 'valueColumnName',
      width: 120,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.tableWhere}',
      field: 'tableWhere',
      minWidth: 180,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{smart.code.views.codeManager.table.remarks}',
      field: 'remarks',
      minWidth: 160,
      align: 'left',
      headerAlign: 'center',
    },
  ];
};
