import {
  SmartColumn,
  SmartSearchFormSchema,
  tableBooleanClass,
  tableUseYnClass,
} from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { getUseYnSelectOptions } from '@/utils/form';
import { Ref, unref } from 'vue';

/**
 * 表格列表
 */
export const getTableColumns = (): SmartColumn[] => {
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
      ...tableBooleanClass('builtInYn'),
      width: 120,
    },
    {
      ...tableUseYnClass(),
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
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (
  t: Function,
  messageType1List: Ref<Array<Recordable>>,
  messageType2List: Ref<Array<Recordable>>,
): FormSchema[] => {
  return [
    {
      field: 'id',
      show: false,
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'channelCode',
      label: t('smart.message.channel.title.channelCode'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'channelName',
      label: t('smart.message.channel.title.channelName'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'channelType1',
      required: true,
      label: t('smart.message.channel.title.channelType1'),
      component: 'Select',
      componentProps: ({ formActionType }) => {
        return {
          onChange: () => formActionType.setFieldsValue({ channelType2: null }),
          options: unref(messageType1List).filter((item) => !item.data),
        };
      },
    },
    {
      field: 'channelType2',
      label: t('smart.message.channel.title.channelType2'),
      component: 'Select',
      componentProps: ({ formModel }) => {
        const channelType1 = formModel.channelType1;
        let options: Recordable[] = [];
        if (channelType1) {
          options = unref(messageType2List).filter((item) => item.data === channelType1);
        }
        return {
          options: options,
        };
      },
    },
    ...getAliyunSmsFormSchemas(),
    ...getTenantSmsFormSchemas(),
    ...getDingtalkWorkNoticeFormSchemas(),
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
      componentProps: {},
    },
  ];
};

/**
 * 阿里云短信配置
 */
const getAliyunSmsFormSchemas = (): FormSchema[] => {
  return [
    {
      field: 'channelProperties.SMS.SMS_ALIYUN.accessKey',
      component: 'Input',
      label: 'Access key',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_ALIYUN';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_ALIYUN',
    },
    {
      field: 'channelProperties.SMS.SMS_ALIYUN.accessSecret',
      component: 'Input',
      label: 'Access secret',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_ALIYUN';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_ALIYUN',
    },
    {
      field: 'channelProperties.SMS.SMS_ALIYUN.endpoint',
      component: 'Input',
      label: 'Endpoint',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_ALIYUN';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_ALIYUN',
    },
  ];
};

/**
 * 阿里云短信配置
 */
const getTenantSmsFormSchemas = (): FormSchema[] => {
  return [
    {
      field: 'channelProperties.SMS.SMS_TENCENT.accessKey',
      component: 'Input',
      label: 'Access key',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT',
    },
    {
      field: 'channelProperties.SMS.SMS_TENCENT.accessSecret',
      component: 'Input',
      label: 'Access secret',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT',
    },
    {
      field: 'channelProperties.SMS.SMS_TENCENT.appid',
      component: 'Input',
      label: 'Appid',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT',
    },
    {
      field: 'channelProperties.SMS.SMS_TENCENT.region',
      component: 'Input',
      label: 'Region',
      show: ({ model }) => {
        return model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT';
      },
      required: ({ model }) => model.channelType1 === 'SMS' && model.channelType2 === 'SMS_TENCENT',
    },
  ];
};

/**
 * 钉钉工作通知
 */
const getDingtalkWorkNoticeFormSchemas = (): FormSchema[] => {
  return [
    {
      field: 'channelProperties.DINGTALK.DINGTALK_WORK_NOTICE.appKey',
      component: 'Input',
      label: 'App key',
      show: ({ model }) => {
        return model.channelType1 === 'DINGTALK' && model.channelType2 === 'DINGTALK_WORK_NOTICE';
      },
      required: ({ model }) =>
        model.channelType1 === 'DINGTALK' && model.channelType2 === 'DINGTALK_WORK_NOTICE',
    },
    {
      field: 'channelProperties.DINGTALK.DINGTALK_WORK_NOTICE.appSecret',
      component: 'Input',
      label: 'App secrett',
      show: ({ model }) => {
        return model.channelType1 === 'DINGTALK' && model.channelType2 === 'DINGTALK_WORK_NOTICE';
      },
      required: ({ model }) =>
        model.channelType1 === 'DINGTALK' && model.channelType2 === 'DINGTALK_WORK_NOTICE',
    },
    {
      field: 'channelProperties.DINGTALK.DINGTALK_WORK_NOTICE.agentId',
      component: 'Input',
      label: 'Agent id',
      show: ({ model }) => {
        return model.channelType1 === 'DINGTALK' && model.channelType2 === 'DINGTALK_WORK_NOTICE';
      },
      required: ({ model }) =>
        model.channelType1 === 'DINGTALK' && model.channelType2 === 'DINGTALK_WORK_NOTICE',
    },
  ];
};

export const getSearchFormSchemas = (
  t: Function,
  messageType1List: Ref,
): SmartSearchFormSchema[] => {
  return [
    {
      field: 'channelCode',
      label: t('smart.message.channel.title.channelCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'channelName',
      label: t('smart.message.channel.title.channelName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'channelType1',
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
      field: 'useYn',
      label: t('common.table.useYn'),
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
