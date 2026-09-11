import type { SmartSearchFormSchema, SmartTableColumn } from '@vben/common-ui';

import { getWebhookDeliveryStatusOptions } from '../../SmartWebhookConstants';

export enum WebhookEventPermission {
  query = 'smart:webhook:event:query',
}

export const getEventTableColumns = (): SmartTableColumn[] => [
  {
    field: 'eventName',
    title: '事件名称',
    width: 180,
    fixed: 'left',
  },
  {
    field: 'eventType',
    title: '事件类型',
    width: 220,
  },
  {
    field: 'eventId',
    title: '事件 ID',
    width: 260,
  },
  {
    field: 'source',
    title: '事件来源',
    width: 180,
  },
  {
    field: 'eventVersion',
    title: '版本',
    width: 100,
    align: 'center',
  },
  {
    field: 'occurredAt',
    title: '发生时间',
    width: 180,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'createTime',
    title: '受理时间',
    width: 180,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right',
    slots: { default: 'table-operation' },
  },
];

export const getEventSearchSchemas = (): SmartSearchFormSchema[] => [
  {
    fieldName: 'eventName',
    label: '事件名称',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'eventId',
    label: '事件 ID',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'eventType',
    label: '事件类型',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'source',
    label: '事件来源',
    component: 'Input',
    searchSymbol: 'like',
  },
];

export const getDeliveryTableColumns = (): SmartTableColumn[] => [
  {
    field: 'eventId',
    title: '事件 ID',
    width: 260,
    fixed: 'left',
  },
  {
    field: 'status',
    title: '投递状态',
    width: 120,
    align: 'center',
    slots: { default: 'table-status' },
  },
  {
    field: 'callbackUrl',
    title: '回调地址',
    minWidth: 360,
  },
  {
    field: 'attemptCount',
    title: '尝试次数',
    width: 100,
    align: 'right',
    sortable: true,
  },
  {
    field: 'lastHttpStatus',
    title: 'HTTP 状态',
    width: 110,
    align: 'center',
    slots: { default: 'table-http-status' },
  },
  {
    field: 'nextRetryAt',
    title: '下次重试',
    width: 180,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'updateTime',
    title: '更新时间',
    width: 180,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right',
    slots: { default: 'table-operation' },
  },
];

export const getDeliverySearchSchemas = (): SmartSearchFormSchema[] => [
  {
    fieldName: 'eventId',
    label: '事件 ID',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'status',
    label: '投递状态',
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: getWebhookDeliveryStatusOptions(),
    },
    searchSymbol: '=',
  },
  {
    fieldName: 'callbackUrl',
    label: '回调地址',
    component: 'Input',
    searchSymbol: 'like',
  },
];
