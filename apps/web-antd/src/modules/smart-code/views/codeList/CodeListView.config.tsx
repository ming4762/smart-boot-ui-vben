import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

const tableTypeList = [
  {
    label: 'smart.code.views.codeManager.title.tableType.single',
    value: '10',
    color: 'green',
  },
  {
    label: 'smart.code.views.codeManager.title.tableType.main',
    value: '20',
    color: 'blue',
  },
  {
    label: 'smart.code.views.codeManager.title.tableType.addendum',
    value: '30',
    color: 'purple',
  },
];

export const tableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      fixed: 'left',
      field: 'checkbox',
    },
    {
      title: '{smart.code.views.codeManager.table.configName}',
      field: 'configName',
      width: 160,
      fixed: 'left',
    },
    {
      title: '{smart.code.views.codeManager.table.tableName}',
      field: 'tableName',
      width: 160,
      fixed: 'left',
    },
    {
      title: '{smart.code.views.codeManager.table.connectionName}',
      field: 'connectionName',
      width: 160,
    },
    {
      title: '{smart.code.views.codeManager.table.type}',
      field: 'type',
      width: 120,
      slots: {
        default: ({ row }) => {
          const value = row.type;
          if (value) {
            const filterList = tableTypeList.filter(
              (item) => item.value === value,
            );
            if (filterList.length > 0) {
              const data = filterList[0];
              if (!data) {
                return '';
              }
              return <Tag color={data.color}>{t(data.label)}</Tag>;
            }
          }
          return '';
        },
      },
    },
    {
      title: '{smart.code.views.codeManager.table.remarks}',
      field: 'remarks',
      minWidth: 200,
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      minWidth: 200,
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
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
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
      width: 120,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 140,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const searchFormColumns = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'configName',
      label: '',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('smart.code.views.codeManager.table.configName'),
      },
    },
    {
      fieldName: 'tableName',
      label: '',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('smart.code.views.codeManager.table.tableName'),
      },
    },
    {
      fieldName: 'type',
      label: '',
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '100px',
        },
        placeholder: t('smart.code.views.codeManager.table.type'),
        options: tableTypeList.map((item) => {
          return {
            ...item,
            label: t(item.label),
          };
        }),
      },
    },
  ];
};
