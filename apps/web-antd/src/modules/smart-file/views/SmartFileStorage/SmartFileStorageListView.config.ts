import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { $t as t } from '@vben/locales';

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
    },
    {
      field: 'id',
      visible: false,
      title: '{smart.file.storage.title.id}',
      width: 120,
    },
    {
      field: 'storageCode',
      title: '{smart.file.storage.title.storageCode}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'storageName',
      title: '{smart.file.storage.title.storageName}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'storageType',
      sortable: true,
      title: '{smart.file.storage.title.storageType}',
      width: 120,
      slots: {
        default: 'table-storageType',
      },
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'defaultStorage',
      title: '{smart.file.storage.title.defaultStorage}',
      width: 140,
      component: 'switch',
      componentProps: {
        disabled: true,
      },
    },
    // {
    //   field: 'storageConfig',
    //   title: '{smart.file.storage.title.storageConfig}',
    //   width: 120,
    // },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      title: '{common.title.useYn}',
      field: 'useYn',
      width: 100,
      component: 'booleanTag',
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 150,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

/**
 * 获取阿里云OSS表单配置
 * @param t
 */
const getAliyunOssFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'storageConfig.ALIYUN_OSS.endpoint',
      component: 'Input',
      label: t('smart.file.storage.title.endpoint'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'ALIYUN_OSS',
        required: (value) => value.storageType === 'ALIYUN_OSS',
      },
    },
    {
      fieldName: 'storageConfig.ALIYUN_OSS.accessKey',
      component: 'Input',
      label: t('smart.file.storage.title.accessKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'ALIYUN_OSS',
        required: (value) => value.storageType === 'ALIYUN_OSS',
      },
    },
    {
      fieldName: 'storageConfig.ALIYUN_OSS.secretKey',
      component: 'Input',
      label: t('smart.file.storage.title.secretKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'ALIYUN_OSS',
        required: (value) => value.storageType === 'ALIYUN_OSS',
      },
    },
    {
      fieldName: 'storageConfig.ALIYUN_OSS.bucketName',
      component: 'Input',
      label: t('smart.file.storage.title.bucketName'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'ALIYUN_OSS',
        required: (value) => value.storageType === 'ALIYUN_OSS',
      },
    },
  ];
};

const getQiniuFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'storageConfig.QINIU.accessKey',
      component: 'Input',
      label: t('smart.file.storage.title.accessKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'QINIU',
        required: (value) => value.storageType === 'QINIU',
      },
    },
    {
      fieldName: 'storageConfig.QINIU.secretKey',
      component: 'InputPassword',
      label: t('smart.file.storage.title.secretKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'QINIU',
        required: (value) => value.storageType === 'QINIU',
      },
    },
    {
      fieldName: 'storageConfig.QINIU.bucketName',
      component: 'Input',
      label: t('smart.file.storage.title.bucketName'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'QINIU',
        required: (value) => value.storageType === 'QINIU',
      },
    },
    {
      fieldName: 'storageConfig.QINIU.region',
      component: 'Input',
      label: t('smart.file.storage.title.region'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'QINIU',
      },
    },
    {
      fieldName: 'storageConfig.QINIU.url',
      component: 'Input',
      label: t('smart.file.storage.title.url'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'QINIU',
        required: (value) => value.storageType === 'QINIU',
      },
    },
    {
      fieldName: 'storageConfig.QINIU.useHttps',
      component: 'Switch',
      label: t('smart.file.storage.title.useHttps'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'QINIU',
      },
    },
  ];
};

const getFtpFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      fieldName: 'storageConfig.FTP.host',
      component: 'Input',
      label: t('smart.file.storage.title.host'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'FTP',
        required: (value) => value.storageType === 'FTP',
      },
    },
    {
      fieldName: 'storageConfig.FTP.port',
      component: 'InputNumber',
      label: t('smart.file.storage.title.port'),
      controlClass: 'w-full',
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'FTP',
        required: (value) => value.storageType === 'FTP',
      },
    },
    {
      fieldName: 'storageConfig.FTP.basePath',
      component: 'Input',
      label: t('smart.file.storage.title.basePath'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'FTP',
        required: (value) => value.storageType === 'FTP',
      },
    },
    {
      fieldName: 'storageConfig.FTP.username',
      component: 'Input',
      label: t('smart.file.storage.title.username'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'FTP',
        required: (value) => value.storageType === 'FTP',
      },
    },
    {
      fieldName: 'storageConfig.FTP.password',
      component: 'Input',
      label: t('smart.file.storage.title.password'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'FTP',
        required: (value) => value.storageType === 'FTP',
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
      label: t('smart.file.storage.title.id'),
      component: 'Input',
      componentProps: {},
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      fieldName: 'storageCode',
      label: t('smart.file.storage.title.storageCode'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'storageName',
      label: t('smart.file.storage.title.storageName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    // {
    //   fieldName: 'defaultStorage',
    //   label: t('smart.file.storage.title.defaultStorage'),
    //   component: 'Switch',
    //   componentProps: {},
    //   colProps: {
    //     span: 12,
    //   },
    // },
    {
      fieldName: 'useYn',
      label: t('common.title.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      rules: 'required',
      defaultValue: 1,
      controlClass: 'w-full',
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
    {
      fieldName: 'storageType',
      label: t('smart.file.storage.title.storageType'),
      component: 'ApiDictSelect',
      controlClass: 'w-full',
      componentProps: {
        dictCode: 'FILE_STORAGE_TYPE',
      },
      rules: 'required',
    },
    // --------------自定义配置信息
    // 磁盘存储配置
    {
      fieldName: 'storageConfig.DISK.basePath',
      component: 'Input',
      label: t('smart.file.storage.title.basePath'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'DISK',
        required: (value) => value.storageType === 'DISK',
      },
    },
    // ---------- minio配置
    {
      fieldName: 'storageConfig.MINIO.endpoint',
      component: 'Input',
      label: t('smart.file.storage.title.endpoint'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'MINIO',
        required: (value) => value.storageType === 'MINIO',
      },
    },
    {
      fieldName: 'storageConfig.MINIO.accessKey',
      component: 'Input',
      label: t('smart.file.storage.title.accessKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'MINIO',
        required: (value) => value.storageType === 'MINIO',
      },
    },
    {
      fieldName: 'storageConfig.MINIO.secretKey',
      component: 'Input',
      label: t('smart.file.storage.title.secretKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'MINIO',
        required: (value) => value.storageType === 'MINIO',
      },
    },
    {
      fieldName: 'storageConfig.MINIO.bucketName',
      component: 'Input',
      label: t('smart.file.storage.title.bucketName'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'MINIO',
        required: (value) => value.storageType === 'MINIO',
      },
    },
    // ------------- sftp
    {
      fieldName: 'storageConfig.SFTP.host',
      component: 'Input',
      label: t('smart.file.storage.title.host'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'SFTP',
        required: (value) => value.storageType === 'SFTP',
      },
    },
    {
      fieldName: 'storageConfig.SFTP.port',
      component: 'InputNumber',
      label: t('smart.file.storage.title.port'),
      controlClass: 'w-full',
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'SFTP',
        required: (value) => value.storageType === 'SFTP',
      },
    },
    {
      fieldName: 'storageConfig.SFTP.basePath',
      component: 'Input',
      label: t('smart.file.storage.title.basePath'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'SFTP',
        required: (value) => value.storageType === 'SFTP',
      },
    },
    {
      fieldName: 'storageConfig.SFTP.username',
      component: 'Input',
      label: t('smart.file.storage.title.username'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'SFTP',
        required: (value) => value.storageType === 'SFTP',
      },
    },
    {
      fieldName: 'storageConfig.SFTP.password',
      component: 'Input',
      label: t('smart.file.storage.title.password'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'SFTP',
        required: (value) => value.storageType === 'SFTP',
      },
    },
    {
      fieldName: 'storageConfig.SFTP.privateKey',
      component: 'Input',
      label: t('smart.file.storage.title.privateKey'),
      dependencies: {
        triggerFields: ['storageType'],
        show: (value) => value.storageType === 'SFTP',
      },
    },
    // --------------- 阿里云OSS
    ...getAliyunOssFormSchemas(),
    // --------------- 七牛云
    ...getQiniuFormSchemas(),
    ...getFtpFormSchemas(),
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'storageCode',
      label: t('smart.file.storage.title.storageCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'storageName',
      label: t('smart.file.storage.title.storageName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'storageType',
      label: t('smart.file.storage.title.storageType'),
      component: 'ApiDictSelect',
      componentProps: {
        dictCode: 'FILE_STORAGE_TYPE',
        style: { width: '140px' },
      },
      searchSymbol: '=',
    },
  ];
};
