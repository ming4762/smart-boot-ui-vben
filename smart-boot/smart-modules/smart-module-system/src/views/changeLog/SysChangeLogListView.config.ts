import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { getTableBooleanColumnClass } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

export enum Permissions {
  delete = 'sys:changeLog:delete',
  save = 'sys:changeLog:save',
  update = 'sys:changeLog:update',
}

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
      field: 'version',
      align: 'left',
      title: '{system.views.changeLog.title.version}',
      width: 120,
    },
    {
      field: 'changeModule',
      align: 'left',
      title: '{system.views.changeLog.title.changeModule}',
      width: 120,
    },
    {
      field: 'logTime',
      align: 'left',
      title: '{system.views.changeLog.title.logTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'title',
      align: 'left',
      title: '{system.views.changeLog.title.title}',
      width: 120,
    },
    {
      field: 'changeContent',
      align: 'left',
      title: '{system.views.changeLog.title.changeContent}',
      width: 120,
    },
    {
      field: 'changeType',
      align: 'left',
      title: '{system.views.changeLog.title.changeType}',
      width: 120,
    },
    {
      field: 'affectedScope',
      align: 'left',
      title: '{system.views.changeLog.title.affectedScope}',
      width: 120,
    },
    {
      field: 'sendSystemMessageYn',
      align: 'left',
      ...getTableBooleanColumnClass('sendSystemMessageYn'),
      title: '{system.views.changeLog.title.sendSystemMessageYn}',
      width: 120,
    },
    {
      field: 'remark',
      align: 'left',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'releaseYn',
      align: 'left',
      ...getTableBooleanColumnClass('releaseYn'),
      title: '{system.views.changeLog.title.releaseYn}',
      width: 120,
    },
    {
      field: 'releaseTime',
      align: 'left',
      title: '{system.views.changeLog.title.releaseTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'releaseBy',
      align: 'left',
      title: '{system.views.changeLog.title.releaseBy}',
      width: 120,
    },
    {
      field: 'revokedYn',
      align: 'left',
      ...getTableBooleanColumnClass('revokedYn'),
      title: '{system.views.changeLog.title.revokedYn}',
      width: 120,
    },
    {
      field: 'revokeTime',
      align: 'left',
      title: '{system.views.changeLog.title.revokeTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'revokeBy',
      align: 'left',
      title: '{system.views.changeLog.title.revokeBy}',
      width: 120,
    },
    {
      field: 'revokeRemark',
      align: 'left',
      title: '{system.views.changeLog.title.revokeRemark}',
      width: 120,
    },
    {
      field: 'createTime',
      align: 'left',
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
      field: 'updateTime',
      align: 'left',
      title: '{common.table.updateTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      align: 'left',
      title: '{common.table.updateUser}',
      width: 120,
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
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'version',
      label: t('system.views.changeLog.title.version'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'changeModule',
      label: t('system.views.changeLog.title.changeModule'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'logTime',
      label: t('system.views.changeLog.title.logTime'),
      component: 'DatePicker',
      controlClass: 'w-full',
      componentProps: {
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'title',
      label: t('system.views.changeLog.title.title'),
      component: 'Textarea',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'changeContent',
      label: t('system.views.changeLog.title.changeContent'),
      component: 'SmartMarkdown',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'changeType',
      label: t('system.views.changeLog.title.changeType'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'affectedScope',
      label: t('system.views.changeLog.title.affectedScope'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'sendSystemMessageYn',
      label: t('system.views.changeLog.title.sendSystemMessageYn'),
      component: 'Switch',
      defaultValue: true,
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'title',
      label: t('system.views.changeLog.title.title'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'changeType',
      label: t('system.views.changeLog.title.changeType'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};
