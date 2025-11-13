import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { $t as t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

import {
  getMessagePriorityEnum,
  getMessageTypeEnum,
} from '#/SmartMessageConstants';

export const getMessageSendStatusEnum = () => {
  return [
    {
      label: t('smart.message.systemMessage.form.sendStatus.NO_SEND'),
      value: 'NO_SEND',
    },
    {
      label: t('smart.message.systemMessage.form.sendStatus.SEND'),
      value: 'SEND',
    },
    {
      label: t('smart.message.systemMessage.form.sendStatus.CANCEL'),
      value: 'CANCEL',
    },
  ];
};

export const getReceiveUserTypeEnum = () => {
  return [
    {
      label: t('smart.message.systemMessage.form.receiveUserType.ALL_USER'),
      value: 'ALL_USER',
    },
    {
      label: t('smart.message.systemMessage.form.receiveUserType.SPECIFY_USER'),
      value: 'SPECIFY_USER',
    },
    {
      label: t(
        'smart.message.systemMessage.form.receiveUserType.BUSINESS_USER',
      ),
      value: 'BUSINESS_USER',
    },
  ];
};

/**
 * 表格列表
 */
export const getTableColumns = (): SmartTableColumn[] => {
  const messageTypeEnum = getMessageTypeEnum();
  const sendStatusEnum = getMessageSendStatusEnum();
  const messagePriorityEnum = getMessagePriorityEnum();
  const receiveUserTypeEnum = getReceiveUserTypeEnum();
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'title',
      title: '{smart.message.systemMessage.title.title}',
      width: 200,
      fixed: 'left',
    },
    {
      field: 'abstractContent',
      title: '{smart.message.systemMessage.title.abstract}',
      width: 120,
    },
    {
      field: 'messageType',
      title: '{smart.message.systemMessage.title.messageType}',
      width: 120,
      dynamicClass: ({ row }: any) => {
        const messageType = row.messageType;
        if (!messageType) {
          return '';
        }
        return messageType === 'ANNOUNCEMENT'
          ? 'text-color--success-bold'
          : 'text-color--link-bold';
      },
      formatter: ({ row }: any) => {
        const messageType = row.messageType;
        if (!messageType) {
          return '';
        }
        const enumList = messageTypeEnum.filter(
          (item) => item.value === row.messageType,
        );
        if (enumList.length === 0) {
          return '';
        }
        const data = enumList[0];
        return data?.label ?? '';
      },
    },
    {
      field: 'sendStatus',
      title: '{smart.message.systemMessage.title.sendStatus}',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.sendStatus) {
            return '';
          }
          const enumList = sendStatusEnum.filter(
            (item) => item.value === row.sendStatus,
          );
          if (enumList.length === 0) {
            return '';
          }
          const data = enumList[0];
          if (!data) {
            return '';
          }
          let color = 'pink';
          if (data.value === 'SEND') {
            color = 'green';
          } else if (data.value === 'CANCEL') {
            color = 'grey';
          }
          return <Tag color={color}>{data.label}</Tag>;
        },
      },
    },
    {
      field: 'priority',
      title: '{smart.message.systemMessage.title.priority}',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.priority) {
            return '';
          }
          const enumList = messagePriorityEnum.filter(
            (item) => item.value === row.priority,
          );
          if (enumList.length === 0) {
            return '';
          }
          const data = enumList[0];
          if (!data) {
            return '';
          }
          let color = 'pink';
          if (data.value === 'MIDDLE') {
            color = 'orange';
          } else if (data.value === 'LOW') {
            color = 'green';
          }
          return <Tag color={color}>{data.label}</Tag>;
        },
      },
    },
    {
      field: 'receiveUserType',
      title: '{smart.message.systemMessage.title.receiveUserType}',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.receiveUserType) {
            return '';
          }
          const enumList = receiveUserTypeEnum.filter(
            (item) => item.value === row.receiveUserType,
          );
          if (enumList.length === 0) {
            return '';
          }
          const data = enumList[0];
          if (!data) {
            return '';
          }
          let color = '#2db7f5';
          if (data.value === 'SPECIFY_USER') {
            color = '#87d068';
          } else if (data.value === 'BUSINESS_USER') {
            color = '#108ee9';
          }
          return <Tag color={color}>{data.label}</Tag>;
        },
      },
    },
    {
      field: 'sendTime',
      title: '{smart.message.systemMessage.title.sendTime}',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'cancelTime',
      title: '{smart.message.systemMessage.title.cancelTime}',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'useYn',
      component: 'booleanTag',
      title: '{common.title.useYn}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 170,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 170,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
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

/**
 * 添加修改表单
 */
export const getFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      label: t('smart.message.systemMessage.title.id'),
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'messageType',
      label: t('smart.message.systemMessage.title.messageType'),
      component: 'RadioGroup',
      componentProps: {
        options: getMessageTypeEnum(),
      },
      defaultValue: 'ANNOUNCEMENT',
    },
    {
      fieldName: 'title',
      label: t('smart.message.systemMessage.title.title'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'abstractContent',
      label: t('smart.message.systemMessage.title.abstract'),
      component: 'Textarea',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'priority',
      label: t('smart.message.systemMessage.title.priority'),
      component: 'RadioGroup',
      componentProps: {
        options: getMessagePriorityEnum(),
      },
      defaultValue: 'H',
    },
    {
      fieldName: 'receiveUserType',
      label: t('smart.message.systemMessage.title.receiveUserType'),
      component: 'RadioGroup',
      componentProps: {
        options: getReceiveUserTypeEnum(),
      },
      defaultValue: 'ALL_USER',
    },
    {
      fieldName: 'userIds',
      label: t('smart.message.systemMessage.title.userIds'),
      component: 'SmartTableSelectUser',
      componentProps: {
        fullscreen: false,
      },
      dependencies: {
        triggerFields: ['receiveUserType'],
        show: (model) => {
          return model.receiveUserType !== 'ALL_USER';
        },
        required: (model) => {
          return model.receiveUserType !== 'ALL_USER';
        },
      },
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Switch',
      defaultValue: true,
      componentProps: {},
    },
    {
      fieldName: 'content',
      label: t('smart.message.systemMessage.title.content'),
      component: 'SmartTinymceEditor',
      componentProps: {
        height: 600,
      },
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'title',
      label: t('smart.message.systemMessage.title.title'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'messageType',
      label: t('smart.message.systemMessage.title.messageType'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getMessageTypeEnum(),
        style: {
          width: '140px',
        },
      },
    },
    {
      fieldName: 'sendStatus',
      label: t('smart.message.systemMessage.title.sendStatus'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getMessageSendStatusEnum(),
        style: {
          width: '140px',
        },
      },
    },
    {
      fieldName: 'priority',
      label: t('smart.message.systemMessage.title.priority'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getMessagePriorityEnum(),
        style: {
          width: '125px',
        },
      },
    },
    {
      fieldName: 'receiveUserType',
      label: t('smart.message.systemMessage.title.receiveUserType'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getReceiveUserTypeEnum(),
        style: {
          width: '140px',
        },
      },
    },
  ];
};

export enum Auth {
  cancel = 'smart:message:systemMessage:cancel',
  delete = 'smart:message:systemMessage:delete',
  publish = 'smart:message:systemMessage:publish',
  save = 'smart:message:systemMessage:save',
  update = 'smart:message:systemMessage:update',
}
