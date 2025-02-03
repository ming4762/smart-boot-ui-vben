import type { Ref } from 'vue';

import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

import { getTableBooleanColumnClass } from '#/adapter/smart-table';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'exceptionMessage',
      fixed: 'left',
      title: '{system.views.exception.title.exceptionMessage}',
      width: 200,
    },
    {
      field: 'requestIp',
      title: '{system.views.exception.title.requestIp}',
      width: 120,
    },
    {
      field: 'serverIp',
      title: '{system.views.exception.title.serverIp}',
      width: 120,
    },
    {
      field: 'requestPath',
      title: '{system.views.exception.title.requestPath}',
      width: 200,
    },
    {
      field: 'operationBy',
      title: '{system.views.exception.title.operateUser}',
      width: 120,
    },
    {
      field: 'tenantId',
      title: '{system.views.exception.title.tenant}',
      width: 120,
      formatter({ row }) {
        return row.tenant?.tenantShortName || row.tenant?.tenantName;
      },
    },
    {
      field: 'createTime',
      sortable: true,
      title: '{common.table.createTime}',
      width: 150,
      type: 'dateTime',
    },
    {
      ...getTableBooleanColumnClass('userFeedback'),
      title: '{system.views.exception.title.userFeedback}',
      width: 120,
      sortable: true,
    },
    {
      field: 'feedbackMessage',
      title: '{system.views.exception.title.feedbackMessage}',
      width: 160,
    },
    {
      field: 'feedbackTime',
      title: '{system.views.exception.title.feedbackTime}',
      width: 150,
      type: 'dateTime',
    },
    {
      ...getTableBooleanColumnClass('resolved'),
      title: '{system.views.exception.title.resolved}',
      width: 120,
      sortable: true,
    },
    {
      field: 'resolvedMessage',
      title: '{system.views.exception.title.resolvedMessage}',
      width: 160,
    },
    {
      field: 'resolvedUserId',
      title: '{system.views.exception.title.resolvedUserId}',
      width: 120,
      formatter({ row }) {
        return row.resolvedUser?.fullName;
      },
    },
    {
      field: 'resolvedTime',
      title: '{system.views.exception.title.resolvedTime}',
      width: 150,
      type: 'dateTime',
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

const getYesNoOptions = () => {
  return [
    {
      label: t('common.title.yes'),
      value: 1,
    },
    {
      label: t('common.title.no'),
      value: 0,
    },
  ];
};

export const getSearchFormSchemas = (
  getIsPlatformTenant: Ref<boolean>,
): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.exception.title.exceptionMessage'),
      fieldName: 'exceptionMessage',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.exception.title.requestIp'),
      fieldName: 'requestIp',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.exception.title.serverIp'),
      fieldName: 'serverIp',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.exception.title.userFeedback'),
      fieldName: 'userFeedback',
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        class: 'w-full',
        options: getYesNoOptions(),
      },
    },
    {
      label: t('system.views.exception.title.resolved'),
      fieldName: 'resolved',
      component: 'Select',
      searchSymbol: '=',
      defaultValue: 0,
      componentProps: {
        options: getYesNoOptions(),
        class: 'w-full',
      },
    },
    {
      label: t('system.views.exception.title.tenant'),
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
};
