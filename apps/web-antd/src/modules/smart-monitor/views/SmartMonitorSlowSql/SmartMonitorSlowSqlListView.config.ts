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
      field: 'checkbox',
    },
    {
      field: 'sqlId',
      align: 'right',
      title: '{smart.monitor.slowSql.title.sqlId}',
      width: 70,
    },
    {
      field: 'dbType',
      sortable: true,
      align: 'left',
      title: '{smart.monitor.slowSql.title.dbType}',
      width: 120,
    },
    {
      field: 'sqlText',
      align: 'left',
      title: '{smart.monitor.slowSql.title.sqlText}',
      minWidth: 240,
    },
    {
      field: 'datasourceName',
      sortable: true,
      align: 'left',
      title: '{smart.monitor.slowSql.title.datasourceName}',
      width: 120,
    },
    {
      field: 'columnList',
      align: 'left',
      title: '{smart.monitor.slowSql.title.columnList}',
      width: 120,
    },
    {
      field: 'timestamp',
      sortable: true,
      align: 'left',
      title: '{smart.monitor.slowSql.title.timestamp}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'useTime',
      sortable: true,
      align: 'right',
      title: '{smart.monitor.slowSql.title.useTime}',
      width: 150,
    },
    {
      field: 'createTime',
      sortable: true,
      align: 'center',
      title: '{common.table.createTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'createBy',
      align: 'left',
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

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'dbType',
      label: t('smart.monitor.slowSql.title.dbType'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'datasourceName',
      label: t('smart.monitor.slowSql.title.datasourceName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};
