import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { h } from 'vue';

import { $t as t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

import {
  getMessagePriorityEnum,
  getMessageTypeEnum,
} from '../../SmartMessageConstants';

export const getTableColumns = (): SmartTableColumn[] => {
  const messageTypeEnum = getMessageTypeEnum();
  const messagePriorityEnum = getMessagePriorityEnum();
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
      minWidth: 200,
      fixed: 'left',
    },
    {
      field: 'messageType',
      title: '{smart.message.systemMessage.title.messageType}',
      width: 120,
      dynamicClass: ({ row }) => {
        const messageType = row.messageType;
        if (!messageType) {
          return '';
        }
        return messageType === 'ANNOUNCEMENT'
          ? 'text-color--success-bold'
          : 'text-color--link-bold';
      },
      formatter: ({ row }) => {
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
      field: 'sendUserName',
      title: '{smart.message.smartMyMessage.title.sendUserName}',
      width: 120,
      type: 'dateTime',
    },
    {
      field: 'sendTime',
      title: '{smart.message.smartMyMessage.title.sendTime}',
      width: 165,
      sortable: true,
      type: 'dateTime',
    },
    {
      field: 'priority',
      title: '{smart.message.systemMessage.title.priority}',
      width: 120,
      sortable: true,
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
          return h(Tag, { color }, { default: () => data.label });
        },
      },
    },
    {
      field: 'readYn',
      title: '{smart.message.smartMyMessage.title.readYn}',
      width: 120,
      autoClass: 'Boolean',
      formatter: ({ row }) => {
        return row.readYn === true
          ? t('common.title.yes')
          : t('common.title.no');
      },
      sortable: true,
    },
    {
      field: 'readTime',
      title: '{smart.message.smartMyMessage.title.readTime}',
      width: 165,
      sortable: true,
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

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'title',
      label: t('smart.message.systemMessage.title.title'),
      component: 'Input',
    },
    {
      fieldName: 'readYn',
      label: t('smart.message.smartMyMessage.title.readYn'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '100px',
        },
        options: [
          {
            label: t('common.title.yes'),
            value: 1,
          },
          {
            label: t('common.title.no'),
            value: 0,
          },
        ],
      },
    },
  ];
};
