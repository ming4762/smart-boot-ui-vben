import type { Ref } from 'vue';

import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { unref } from 'vue';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
  z,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { isJsonString } from '@vben/utils';

import { getUseYnSelectOptions } from '@smart/common/utils';

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
      field: 'channelCode',
      title: '{smart.message.channel.title.channelCode}',
      width: 120,
    },
    {
      field: 'channelName',
      title: '{smart.message.channel.title.channelName}',
      width: 120,
    },
    {
      field: 'channelType1',
      title: '{smart.message.channel.title.channelType1}',
      width: 120,
    },
    {
      field: 'channelType2',
      title: '{smart.message.channel.title.channelType2}',
      width: 120,
    },
    {
      field: 'builtInYn',
      title: '{smart.message.channel.title.builtInYn}',
      ...getTableBooleanColumnClass('builtInYn'),
      width: 120,
    },
    {
      ...getTableUseYnColumnClass(),
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      minWidth: 200,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
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
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
  ];
};

/**
 * 阿里云短信配置
 */
const getAliyunSmsFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'channelProperties.SMS.SMS_ALIYUN.accessKey',
      component: 'Input',
      label: 'Access key',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_ALIYUN'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_ALIYUN',
      },
    },
    {
      fieldName: 'channelProperties.SMS.SMS_ALIYUN.accessSecret',
      component: 'Input',
      label: 'Access secret',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_ALIYUN'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_ALIYUN',
      },
    },
    {
      fieldName: 'channelProperties.SMS.SMS_ALIYUN.endpoint',
      component: 'Input',
      label: 'Endpoint',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_ALIYUN'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_ALIYUN',
      },
    },
  ];
};

/**
 * 阿里云短信配置
 */
const getTenantSmsFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'channelProperties.SMS.SMS_TENCENT.accessKey',
      component: 'Input',
      label: 'Access key',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT',
      },
    },
    {
      fieldName: 'channelProperties.SMS.SMS_TENCENT.accessSecret',
      component: 'Input',
      label: 'Access secret',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT',
      },
    },
    {
      fieldName: 'channelProperties.SMS.SMS_TENCENT.appid',
      component: 'Input',
      label: 'Appid',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT',
      },
    },
    {
      fieldName: 'channelProperties.SMS.SMS_TENCENT.region',
      component: 'Input',
      label: 'Region',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT'
          );
        },
        required: (value) =>
          value.channelType1 === 'SMS' && value.channelType2 === 'SMS_TENCENT',
      },
    },
  ];
};

/**
 * 钉钉工作通知
 */
const getDingtalkWorkNoticeFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'channelProperties.DINGTALK.DINGTALK_WORK_NOTICE.appKey',
      component: 'Input',
      label: 'App key',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'DINGTALK' &&
            value.channelType2 === 'DINGTALK_WORK_NOTICE'
          );
        },
        required: (value) =>
          value.channelType1 === 'DINGTALK' &&
          value.channelType2 === 'DINGTALK_WORK_NOTICE',
      },
    },
    {
      fieldName: 'channelProperties.DINGTALK.DINGTALK_WORK_NOTICE.appSecret',
      component: 'Input',
      label: 'App secrett',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'DINGTALK' &&
            value.channelType2 === 'DINGTALK_WORK_NOTICE'
          );
        },
        required: (value) =>
          value.channelType1 === 'DINGTALK' &&
          value.channelType2 === 'DINGTALK_WORK_NOTICE',
      },
    },
    {
      fieldName: 'channelProperties.DINGTALK.DINGTALK_WORK_NOTICE.agentId',
      component: 'Input',
      label: 'Agent id',
      dependencies: {
        triggerFields: ['channelType1', 'channelType2'],
        show: (value) => {
          return (
            value.channelType1 === 'DINGTALK' &&
            value.channelType2 === 'DINGTALK_WORK_NOTICE'
          );
        },
        required: (value) =>
          value.channelType1 === 'DINGTALK' &&
          value.channelType2 === 'DINGTALK_WORK_NOTICE',
      },
    },
  ];
};

const getEmailFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'channelProperties.EMAIL.host',
      component: 'Input',
      label: 'Host',
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return value.channelType1 === 'EMAIL';
        },
        required: (value) => value.channelType1 === 'EMAIL',
      },
    },
    {
      fieldName: 'channelProperties.EMAIL.port',
      component: 'Input',
      label: 'Port',
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return value.channelType1 === 'EMAIL';
        },
        required: (value) => value.channelType1 === 'EMAIL',
      },
    },
    {
      fieldName: 'channelProperties.EMAIL.username',
      component: 'Input',
      label: 'Username',
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return value.channelType1 === 'EMAIL';
        },
      },
      // required: ({ model }) => model.channelType1 === 'EMAIL',
    },
    {
      fieldName: 'channelProperties.EMAIL.password',
      component: 'Input',
      label: 'Password',
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return value.channelType1 === 'EMAIL';
        },
      },
      // required: ({ model }) => model.channelType1 === 'EMAIL',
    },
    {
      fieldName: 'channelProperties.EMAIL.protocol',
      component: 'Input',
      label: 'Protocol',
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return value.channelType1 === 'EMAIL';
        },
        required: (value) => value.channelType1 === 'EMAIL',
      },
      defaultValue: 'smtp',
    },
    {
      fieldName: 'channelProperties.EMAIL.properties',
      component: 'Textarea',
      label: 'Properties',
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return value.channelType1 === 'EMAIL';
        },
      },
      rules: z.string().refine(
        (value) => {
          if (!value) {
            return true;
          }
          return isJsonString(value);
        },
        {
          message: 'data必须为json字符串',
        },
      ),
      // required: ({ model }) => model.channelType1 === 'EMAIL',
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (
  messageType1List: Ref<Array<Recordable<any>>>,
  messageType2List: Ref<Array<Recordable<any>>>,
): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      label: '',
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'channelCode',
      label: t('smart.message.channel.title.channelCode'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'channelName',
      label: t('smart.message.channel.title.channelName'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'channelType1',
      rules: 'required',
      label: t('smart.message.channel.title.channelType1'),
      component: 'Select',
      controlClass: 'w-full',
      componentProps: (_, formActionType) => {
        return {
          onChange: () => formActionType.setFieldValue('channelType2', null),
          options: unref(messageType1List).filter((item) => !item.data),
        };
      },
    },
    {
      fieldName: 'channelType2',
      label: t('smart.message.channel.title.channelType2'),
      component: 'Select',
      controlClass: 'w-full',
      componentProps: (formModel) => {
        const channelType1 = formModel.channelType1;
        let options: Recordable<any>[] = [];
        if (channelType1) {
          options = unref(messageType2List).filter(
            (item) => item.data === channelType1,
          );
        }
        return {
          options,
        };
      },
      dependencies: {
        triggerFields: ['channelType1'],
        show: (value) => {
          return ['DINGTALK', 'SMS'].includes(value.channelType1);
        },
      },
    },
    ...getAliyunSmsFormSchemas(),
    ...getTenantSmsFormSchemas(),
    ...getDingtalkWorkNoticeFormSchemas(),
    ...getEmailFormSchemas(),
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      controlClass: 'w-full',
      componentProps: {},
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (
  messageType1List: Ref,
): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'channelCode',
      label: t('smart.message.channel.title.channelCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'channelName',
      label: t('smart.message.channel.title.channelName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'channelType1',
      label: t('smart.message.channel.title.channelType1'),
      component: 'Select',
      componentProps: () => {
        return {
          options: unref(messageType1List),
          style: { width: '110px' },
        };
      },
      searchSymbol: '=',
    },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Select',
      componentProps: {
        options: getUseYnSelectOptions(),
        style: { width: '100px' },
      },
      defaultValue: 1,
      searchSymbol: '=',
    },
  ];
};
