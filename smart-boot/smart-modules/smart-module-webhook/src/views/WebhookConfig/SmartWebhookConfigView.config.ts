import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { getTableUseYnColumnClass } from '@vben/common-ui';

import { getUseYnSelectOptions } from '@smart/common/utils';

import { getWebhookConfigStatusOptions } from '../../SmartWebhookConstants';

export enum WebhookClientPermission {
  delete = 'smart:webhook:client:delete',
  query = 'smart:webhook:client:query',
  save = 'smart:webhook:client:save',
  setUseYn = 'smart:webhook:client:setUseYn',
  update = 'smart:webhook:client:update',
}

export const getClientTableColumns = (): SmartTableColumn[] => [
  {
    type: 'checkbox',
    width: 52,
    align: 'center',
    fixed: 'left',
  },
  {
    field: 'clientCode',
    title: '客户端编码',
    width: 180,
    fixed: 'left',
  },
  {
    field: 'clientName',
    title: '客户端名称',
    minWidth: 180,
  },
  {
    field: 'useYn',
    ...getTableUseYnColumnClass(),
    width: 100,
  },
  {
    field: 'description',
    title: '说明',
    minWidth: 220,
  },
  {
    field: 'createTime',
    title: '创建时间',
    width: 170,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'updateTime',
    title: '更新时间',
    width: 170,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'operation',
    title: '操作',
    width: 130,
    fixed: 'right',
    slots: { default: 'table-operation' },
  },
];

export const getClientSearchSchemas = (): SmartSearchFormSchema[] => [
  {
    fieldName: 'clientCode',
    label: '客户端编码',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'clientName',
    label: '客户端名称',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'useYn',
    label: '启用状态',
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: getUseYnSelectOptions(),
    },
    searchSymbol: '=',
  },
];

export const getClientFormSchemas = (): VbenFormSchema[] => [
  {
    fieldName: 'id',
    label: '',
    component: 'Input',
    dependencies: {
      triggerFields: ['id'],
      show: false,
    },
  },
  {
    fieldName: 'clientCode',
    label: '客户端编码',
    component: 'Input',
    componentProps: { maxlength: 64 },
    rules: 'required',
  },
  {
    fieldName: 'clientName',
    label: '客户端名称',
    component: 'Input',
    componentProps: { maxlength: 128 },
    rules: 'required',
  },
  {
    fieldName: 'description',
    label: '说明',
    component: 'Textarea',
    componentProps: {
      maxlength: 512,
      rows: 4,
      showCount: true,
    },
  },
];

export const getSubscriptionTableColumns = (): SmartTableColumn[] => [
  {
    type: 'checkbox',
    width: 52,
    align: 'center',
    fixed: 'left',
  },
  {
    field: 'eventType',
    title: '事件类型',
    width: 220,
    fixed: 'left',
  },
  {
    field: 'callbackUrl',
    title: '回调地址',
    minWidth: 360,
  },
  {
    field: 'status',
    title: '状态',
    width: 100,
    align: 'center',
    slots: { default: 'table-status' },
  },
  {
    field: 'createTime',
    title: '创建时间',
    width: 170,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'updateTime',
    title: '更新时间',
    width: 170,
    formatter: 'datetime',
    sortable: true,
  },
  {
    field: 'operation',
    title: '操作',
    width: 130,
    fixed: 'right',
    slots: { default: 'table-operation' },
  },
];

export const getSubscriptionSearchSchemas = (): SmartSearchFormSchema[] => [
  {
    fieldName: 'eventType',
    label: '事件类型',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'callbackUrl',
    label: '回调地址',
    component: 'Input',
    searchSymbol: 'like',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: getWebhookConfigStatusOptions(),
    },
    searchSymbol: '=',
  },
];

export const getSubscriptionFormSchemas = (): VbenFormSchema[] => [
  {
    fieldName: 'id',
    label: '',
    component: 'Input',
    dependencies: {
      triggerFields: ['id'],
      show: false,
    },
  },
  {
    fieldName: 'eventType',
    label: '事件类型',
    component: 'Input',
    componentProps: {
      maxlength: 128,
      placeholder: '例如 USER_REGISTERED',
    },
    rules: 'required',
  },
  {
    fieldName: 'callbackUrl',
    label: '回调地址',
    component: 'Input',
    componentProps: {
      maxlength: 1024,
      placeholder: 'https://example.com/webhook',
    },
    rules: 'required',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: { options: getWebhookConfigStatusOptions() },
    defaultValue: 'ENABLED',
    rules: 'required',
  },
];
