import type {
  SmartSearchFormSchema,
  SmartTableColumn,
  VbenFormSchema,
} from '@vben/common-ui';

import { $t as t } from '@vben/locales';

import { listFileStorageApi } from './LicenseListView.api';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'licenseCode',
      title: '{system.views.license.title.licenseCode}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'licenseName',
      title: '{system.views.license.title.licenseName}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'macAddress',
      title: '{system.views.license.title.macAddress}',
      width: 200,
    },
    {
      field: 'ipAddress',
      title: '{system.views.license.title.ipAddress}',
      width: 200,
    },
    {
      field: 'cpuSerial',
      title: '{system.views.license.title.cpuSerial}',
      width: 200,
    },
    {
      field: 'mainBoardSerial',
      title: '{system.views.license.title.mainBoardSerial}',
      width: 200,
    },
    {
      field: 'enterprise',
      title: '{system.views.license.title.enterprise}',
      width: 160,
    },
    {
      field: 'version',
      title: '{system.views.license.title.version}',
      width: 160,
      sortable: true,
    },
    {
      field: 'contractNo',
      title: '{system.views.license.title.contractNo}',
      width: 160,
    },
    {
      field: 'effectiveTime',
      title: '{system.views.license.title.effectiveTime}',
      width: 160,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'expirationTime',
      title: '{system.views.license.title.expirationTime}',
      width: 160,
      sortable: true,
      formatter: 'datetime',
    },
    {
      field: 'status',
      title: '{system.views.license.title.status}',
      width: 120,
      sortable: true,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 160,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
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
      width: 160,
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
      width: 145,
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
      label: t('system.views.license.title.licenseCode'),
      fieldName: 'licenseCode',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.license.title.licenseName'),
      fieldName: 'licenseName',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.license.title.version'),
      fieldName: 'version',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.license.title.status'),
      fieldName: 'status',
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};

export const getAddEditFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      label: '',
      fieldName: 'id',
      component: 'Divider',
      labelWidth: 0,
      componentProps: {
        class: 'form-divider',
        orientation: 'left',
      },
      renderComponentContent: () => {
        return {
          default: () => t('system.views.license.title.basic'),
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      label: t('system.views.license.title.licenseCode'),
      fieldName: 'licenseCode',
      componentProps: {
        disabled: true,
      },
      component: 'Input',
    },
    {
      label: t('system.views.license.title.licenseName'),
      fieldName: 'licenseName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.license.title.times'),
      fieldName: 'times',
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      rules: 'required',
      defaultValue: 1,
      component: 'InputNumber',
    },
    {
      label: t('system.views.license.title.subject'),
      fieldName: 'subject',
      component: 'Input',
      rules: 'required',
    },
    {
      label: '',
      fieldName: 'status',
      component: 'Input',
      dependencies: {
        triggerFields: ['status'],
        show: false,
      },
    },
    {
      label: t('system.views.license.title.secretKey'),
      fieldName: 'secretKeyId',
      rules: 'required',
      slot: 'form-secretKey',
      component: 'Input',
    },
    {
      label: t('system.views.license.title.fileStorage'),
      fieldName: 'fileStorageId',
      component: 'SmartPulldownTable',
      rules: 'required',
      componentProps: {
        pulldownProps: {
          destroyOnClose: false,
        },
        valueField: 'id',
        showFunction: (row: any) => row.storageName,
        api: () => {
          return listFileStorageApi({});
        },
        tableProps: {
          border: true,
          size: 'mini',
          columns: [
            {
              field: 'storageCode',
              title: '存储器编码',
              width: 160,
              fixed: 'left',
            },
            {
              field: 'storageName',
              title: '存储器名称',
              width: 160,
              fixed: 'left',
            },
            {
              field: 'storageType',
              sortable: true,
              title: '类型',
              width: 120,
            },
          ],
        },
      },
    },
    {
      label: '',
      fieldName: 'id',
      component: 'Divider',
      labelWidth: 0,
      componentProps: {
        class: 'form-divider',
        orientation: 'left',
      },
      renderComponentContent: () => {
        return {
          default: () => t('system.views.license.title.serverInfo'),
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      label: t('system.views.license.title.macAddress'),
      fieldName: 'macAddress',
      component: 'Input',
    },
    {
      label: t('system.views.license.title.ipAddress'),
      fieldName: 'ipAddress',
      component: 'Input',
    },
    {
      label: t('system.views.license.title.cpuSerial'),
      fieldName: 'cpuSerial',
      component: 'Input',
    },
    {
      label: t('system.views.license.title.mainBoardSerial'),
      fieldName: 'mainBoardSerial',
      component: 'Input',
    },
    {
      label: '',
      fieldName: 'id',
      component: 'Divider',
      labelWidth: 0,
      componentProps: {
        class: 'form-divider',
        orientation: 'left',
      },
      renderComponentContent: () => {
        return {
          default: () => t('system.views.license.title.projectInfo'),
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      label: t('system.views.license.title.enterprise'),
      fieldName: 'enterprise',
      component: 'Input',
    },
    {
      label: t('system.views.license.title.project'),
      fieldName: 'systemName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '',
      fieldName: 'systemId',
      component: 'Input',
      dependencies: {
        triggerFields: ['systemId'],
        show: false,
      },
    },
    {
      label: t('system.views.license.title.version'),
      fieldName: 'version',
      component: 'Input',
    },
    {
      label: t('system.views.license.title.contractNo'),
      fieldName: 'contractNo',
      component: 'Input',
    },
  ];
};

export enum Permissions {
  delete = 'sys:license:delete',
  download = 'sys:license:download',
  generator = 'sys:license:generator',
  query = 'sys:license:query',
  save = 'sys:license:save',
  update = 'sys:license:update',
}
