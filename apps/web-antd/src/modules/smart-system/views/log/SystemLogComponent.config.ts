import type { Ref } from 'vue';

import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

import dayjs from 'dayjs';

export type LoginIdent = 'INTERFACE_LOG' | 'LOGIN_LOG';

const tableColumns: Array<SmartTableColumn & { ident?: LoginIdent[] }> = [
  {
    type: 'seq',
    width: 80,
  },
  {
    title: '{system.views.log.title.operation}',
    field: 'operation',
    minWidth: 200,
  },
  {
    title: '{system.views.log.title.logSource}',
    field: 'logSource',
    width: 180,
  },
  {
    title: '{system.views.log.title.createUserId}',
    field: 'createBy',
    width: 120,
  },
  {
    title: '{system.views.log.title.tenant}',
    field: 'tenantId',
    width: 120,
    formatter: ({ row }) => {
      return row.tenant?.tenantShortName || row.tenant?.tenantName;
    },
  },
  {
    title: '{system.views.log.title.ip}',
    field: 'ip',
    width: 160,
  },
  {
    title: '{system.views.log.title.operationType}',
    field: 'operationType',
    headerAlign: 'left',
    align: 'center',
    width: 120,
    ident: ['INTERFACE_LOG'],
  },
  {
    title: '{system.views.log.title.requestPath}',
    field: 'requestPath',
    width: 200,
    ident: ['INTERFACE_LOG'],
  },
  {
    title: '{system.views.log.title.statusCode}',
    field: 'statusCode',
    width: 120,
    headerAlign: 'left',
    align: 'center',
    slots: {
      default: 'table-statusCode',
    },
    sortable: true,
  },
  {
    title: '{system.views.log.title.method}',
    field: 'method',
    width: 200,
    ident: ['INTERFACE_LOG'],
  },
  {
    title: '{system.views.log.title.useTime}',
    field: 'useTime',
    width: 140,
    headerAlign: 'left',
    align: 'center',
    sortable: true,
    slots: {
      default: 'table-useTime',
    },
    ident: ['INTERFACE_LOG'],
  },
  {
    title: '{system.views.log.title.createTime}',
    field: 'createTime',
    width: 180,
    sortable: true,
    type: 'dateTime',
  },
  {
    title: '{common.table.operation}',
    field: 'table-operation',
    width: 100,
    fixed: 'right',
    slots: {
      default: 'table-operation',
    },
  },
];

/**
 * 获取表格列表
 * @param ident 标识位
 */
export const getTableColumns = (ident: LoginIdent): SmartTableColumn[] => {
  return tableColumns.filter((item) => {
    return item.ident === undefined || item.ident.includes(ident);
  }) as SmartTableColumn[];
};

const logSourceEnum = [
  {
    value: '10',
    enumName: 'AUTO_POINTCUT',
    label: 'system.views.log.title.logSourceAuto',
    ident: ['INTERFACE_LOG'],
  },
  {
    value: '20',
    enumName: 'MANUAL',
    label: 'system.views.log.title.logSourceManual',
    ident: ['INTERFACE_LOG'],
  },
  {
    value: '30',
    enumName: 'LOGIN',
    label: 'system.views.log.title.logSourceLoginSuccess',
    ident: ['LOGIN_LOG'],
  },
  {
    value: '40',
    enumName: 'LOGOUT',
    label: 'system.views.log.title.logSourceLogout',
    ident: ['LOGIN_LOG'],
  },
  {
    value: '50',
    enumName: 'LOGIN_FAIL',
    label: 'system.views.log.title.logSourceLoginFail',
    ident: ['LOGIN_LOG'],
  },
];

export const getLogSourceEnum = (ident: LoginIdent) => {
  return logSourceEnum
    .filter((item) => item.ident === undefined || item.ident.includes(ident))
    .map((item) => {
      return {
        value: item.value,
        label: t(item.label),
      };
    });
};

const operationTypeEnum = [
  {
    value: 'ADD',
    label: 'system.views.log.title.operationTypeAdd',
  },
  {
    value: 'DELETE',
    label: 'system.views.log.title.operationTypeDelete',
  },
  {
    value: 'UPDATE',
    label: 'system.views.log.title.operationTypeUpdate',
  },
  {
    value: 'QUERY',
    label: 'system.views.log.title.operationTypeQuery',
  },
];
export const getOperationTypeEnum = () => {
  return operationTypeEnum.map((item) => {
    return {
      label: t(item.label),
      value: item.value,
    };
  });
};
/**
 * 获取搜索表单
 * @param ident
 * @param getIsPlatformTenant
 */
export const getSearchFormSchemas = (
  ident: LoginIdent,
  getIsPlatformTenant: Ref<boolean>,
) => {
  const schemas: Array<SmartSearchFormSchema & { ident?: LoginIdent[] }> = [
    {
      label: t('system.views.log.title.operation'),
      fieldName: 'operation',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.log.title.logSource'),
      fieldName: 'logSource',
      component: 'Select',
      componentProps: {
        mode: 'multiple',
        style: { width: '200px' },
        options: getLogSourceEnum(ident),
      },
      searchSymbol: 'in',
    },
    {
      label: t('system.views.log.title.statusCode'),
      fieldName: 'statusCode',
      component: 'Input',
      searchSymbol: '=',
      componentProps: {
        style: { width: '120px' },
      },
    },
    {
      label: t('system.views.log.title.createTime'),
      fieldName: 'createTime',
      component: 'RangePicker',
      searchSymbol: 'between',
      componentProps: {
        style: { width: '340px' },
        showTime: {
          defaultValue: [dayjs('00:00:00', 'HH:mm:ss')],
        },
      },
    },
    {
      label: t('system.views.log.title.operationType'),
      fieldName: 'operationType',
      component: 'Select',
      searchSymbol: '=',
      ident: ['INTERFACE_LOG'],
      componentProps: {
        optionLabelProp: 'children',
        mode: 'multiple',
        style: { width: '120px' },
        options: getOperationTypeEnum(),
      },
    },
    {
      label: t('system.views.log.title.tenant'),
      fieldName: 'tenantId',
      slot: 'search-tenantId',
      component: 'Input',
      searchSymbol: '=',
      dependencies: {
        triggerFields: ['tenantId'],
        show: unref(getIsPlatformTenant),
      },
    },
  ];
  return schemas.filter(
    (item) => item.ident === undefined || item.ident.includes(ident),
  );
};
