import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { $t as t } from '@vben/locales';

export enum Permissions {
  create = 'sys:releaseNote:create',
  delete = 'sys:releaseNote:delete',
  update = 'sys:releaseNote:update',
}

export const getTableColumns = (): SmartTableColumn[] => [
  { type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
  { field: 'version', title: '版本号', width: 120 },
  { field: 'title', title: '标题', minWidth: 200 },
  { field: 'status', title: '状态', width: 120 },
  { field: 'reminderLevel', title: '提醒级别', width: 120 },
  { field: 'publishedTime', title: '发布时间', width: 170, formatter: 'datetime' },
  { field: 'publishedBy', title: '发布人', width: 120 },
  { field: 'messageDeliveryStatus', title: '消息投递状态', width: 140 },
  { field: 'createTime', title: '{common.table.createTime}', width: 170, formatter: 'datetime' },
];

export const getFormSchemas = (): VbenFormSchema[] => [
  {
    fieldName: 'id',
    label: '',
    component: 'Input',
    dependencies: { triggerFields: ['id'], show: false },
  },
  {
    fieldName: 'lockVersion',
    label: '',
    component: 'InputNumber',
    dependencies: { triggerFields: ['lockVersion'], show: false },
  },
  {
    fieldName: 'version',
    label: '版本号',
    component: 'Input',
    componentProps: { placeholder: '例如 2.6.0' },
    rules: 'required',
  },
  {
    fieldName: 'title',
    label: '标题',
    component: 'Input',
    rules: 'required',
  },
  {
    fieldName: 'content',
    label: '更新内容',
    component: 'SmartMarkdown',
    componentProps: { height: 500 },
    rules: 'required',
  },
  {
    fieldName: 'reminderLevel',
    label: '提醒级别',
    component: 'Select',
    defaultValue: 'NORMAL',
    componentProps: {
      options: [
        { label: '普通（仅更新日志未读标记）', value: 'NORMAL' },
        { label: '重大（额外投递系统消息）', value: 'IMPORTANT' },
      ],
    },
    rules: 'required',
  },
];

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => [
  { fieldName: 'version', label: '版本号', component: 'Input', searchSymbol: '=' },
  { fieldName: 'status', label: '状态', component: 'Input', searchSymbol: '=' },
  { fieldName: 'title', label: t('common.table.name'), component: 'Input', searchSymbol: 'like' },
];
