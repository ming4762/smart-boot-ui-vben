import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { type ComputedRef, type Ref, unref } from 'vue';

import { $t as t } from '@vben/locales';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
} from '#/adapter/smart-table';

import { listNoBindPackageByTenantIdApi } from './SysTenantListView.api';

export enum Permission {
  bindUser = 'sys:tenant:manager:bindUser',
  delete = 'sys:tenant:manager:delete',
  save = 'sys:tenant:manager:save',
  subscribeAddUpdate = 'sys:tenant:manager:subscribe:addUpdate',
  subscribeDelete = 'sys:tenant:manager:subscribe:delete',
  subscribeSetUseYn = 'sys:tenant:manager:subscribe:setUseYn',
  update = 'sys:tenant:manager:update',
  useYn = 'sys:tenant:manager:setUseYn',
}

export const SYSTEM_TENANT_TYPE_DICT = 'SYSTEM_TENANT_TYPE';
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
      field: 'tenantCode',
      title: '{system.views.tenant.manager.title.tenantCode}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'tenantName',
      title: '{system.views.tenant.manager.title.tenantName}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'tenantShortName',
      title: '{system.views.tenant.manager.title.tenantShortName}',
      width: 120,
    },
    {
      field: 'type',
      title: '{system.views.tenant.manager.title.type}',
      width: 120,
      sortable: true,
      slots: {
        default: 'table-type',
      },
    },
    {
      ...getTableBooleanColumnClass('platformYn'),
      title: '{system.views.tenant.manager.title.platformYn}',
    },
    {
      field: 'contacts',
      title: '{system.views.tenant.manager.title.contacts}',
      width: 120,
    },
    {
      field: 'contactPhone',
      title: '{system.views.tenant.manager.title.contactPhone}',
      width: 120,
    },
    {
      field: 'email',
      title: '{system.views.tenant.manager.title.email}',
      width: 120,
    },
    {
      field: 'isolationStrategy',
      title: '{system.views.tenant.manager.title.isolationStrategy}',
      width: 120,
      slots: {
        default: 'table-isolationStrategy',
      },
    },
    {
      field: 'industry',
      title: '{system.views.tenant.manager.title.industry}',
      width: 120,
    },
    {
      field: 'domain',
      title: '{system.views.tenant.manager.title.domain}',
      width: 120,
    },
    {
      field: 'availableUserNum',
      title: '{system.views.tenant.manager.title.availableUserNum}',
      width: 120,
    },
    {
      field: 'region',
      title: '{system.views.tenant.manager.title.region}',
      width: 120,
    },
    {
      field: 'address',
      title: '{system.views.tenant.manager.title.address}',
      width: 120,
    },
    {
      field: 'logoId',
      title: '{system.views.tenant.manager.title.logoId}',
      width: 120,
    },
    {
      field: 'effectTime',
      title: '{system.views.tenant.manager.title.effectTime}',
      width: 165,
      sortable: true,
    },
    {
      field: 'expireTime',
      title: '{system.views.tenant.manager.title.expireTime}',
      width: 165,
      sortable: true,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
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
      width: 165,
      sortable: true,
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
  isolationStrategyListRef: Ref,
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
      fieldName: 'tenantCode',
      label: t('system.views.tenant.manager.title.tenantCode'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'tenantName',
      label: t('system.views.tenant.manager.title.tenantName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'tenantShortName',
      label: t('system.views.tenant.manager.title.tenantShortName'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'type',
      label: t('system.views.tenant.manager.title.type'),
      component: 'ApiDictSelect',
      componentProps: {
        dictCode: SYSTEM_TENANT_TYPE_DICT,
        labelWithCode: true,
      },
      rules: 'required',
      controlClass: 'w-full',
      defaultValue: '10',
    },
    {
      fieldName: 'contacts',
      label: t('system.views.tenant.manager.title.contacts'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'contactPhone',
      label: t('system.views.tenant.manager.title.contactPhone'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'email',
      label: t('system.views.tenant.manager.title.email'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'isolationStrategy',
      label: t('system.views.tenant.manager.title.isolationStrategy'),
      component: 'Select',
      componentProps: () => {
        return {
          options: unref(isolationStrategyListRef),
        };
      },
      controlClass: 'w-full',
      rules: 'required',
    },
    {
      fieldName: 'industry',
      label: t('system.views.tenant.manager.title.industry'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'domain',
      label: t('system.views.tenant.manager.title.domain'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'availableUserNum',
      label: t('system.views.tenant.manager.title.availableUserNum'),
      component: 'Input',
      componentProps: {},
    },
    {
      fieldName: 'region',
      label: t('system.views.tenant.manager.title.region'),
      component: 'Cascader',
      controlClass: 'w-full',
      componentProps: {},
    },
    {
      fieldName: 'effectExpireTime',
      label: t('system.views.tenant.manager.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
    },
    {
      fieldName: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      controlClass: 'w-full',
      defaultValue: 1,
    },
    {
      fieldName: 'address',
      label: t('system.views.tenant.manager.title.address'),
      component: 'Textarea',
      componentProps: {},
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
    {
      fieldName: 'logoId',
      label: t('system.views.tenant.manager.title.logoId'),
      component: 'Input',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'tenantCode',
      label: t('system.views.tenant.manager.title.tenantCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'tenantName',
      label: t('system.views.tenant.manager.title.tenantName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'tenantShortName',
      label: t('system.views.tenant.manager.title.tenantShortName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'type',
      label: t('system.views.tenant.manager.title.type'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'isolationStrategy',
      label: t('system.views.tenant.manager.title.isolationStrategy'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'effectTime',
      label: t('system.views.tenant.manager.title.effectTime'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      fieldName: 'expireTime',
      label: t('system.views.tenant.manager.title.expireTime'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};

/**
 * 绑定用户tab
 */
export const getTabUserListColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      title: '{system.views.tenant.manager.title.user.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.tenant.manager.title.user.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'accountId',
      title: '{system.views.tenant.manager.title.user.hasAccount}',
      formatter({ row }) {
        const accountId = row.accountId;
        if (accountId) {
          return t('common.title.yes');
        }
        return t('common.title.no');
      },
      align: 'center',
      className({ row }) {
        const accountId = row.accountId;
        if (accountId) {
          return 'text-color--success-bold';
        }
        return 'text-color--danger-bold';
      },
      width: 100,
    },
    {
      title: '{system.views.tenant.manager.title.user.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.tenant.manager.title.user.mobile}',
      field: 'mobile',
      minWidth: 140,
    },
    {
      title: '{system.views.tenant.manager.title.user.bindTime}',
      field: 'createTime',
      width: 165,
    },
    {
      title: '{system.views.tenant.manager.title.user.bindBy}',
      field: 'createBy',
      width: 120,
    },
  ];
};

export const getTabUserListSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      fieldName: 'username',
      label: t('system.views.tenant.manager.title.user.username'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      fieldName: 'fullName',
      label: t('system.views.tenant.manager.title.user.fullName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};

/**
 * 绑定用户modal
 */
export const getBindUserModalListColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      title: '{system.views.tenant.manager.title.user.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.tenant.manager.title.user.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.tenant.manager.title.user.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.tenant.manager.title.user.mobile}',
      field: 'mobile',
      minWidth: 140,
    },
  ];
};

export const getSubscribeTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'packageId',
      title: '{system.views.tenant.manager.title.subscribe.packageId}',
      width: 200,
      formatter({ row }) {
        const tenantPackage = row.tenantPackage;
        if (!tenantPackage) {
          return '';
        }
        return `${tenantPackage.packageCode || ''} - ${tenantPackage.packageName || ''}`;
      },
    },
    {
      field: 'effectTime',
      sortable: true,
      title: '{system.views.tenant.manager.title.subscribe.effectTime}',
      width: 165,
    },
    {
      field: 'expireTime',
      sortable: true,
      title: '{system.views.tenant.manager.title.subscribe.expireTime}',
      width: 165,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      minWidth: 200,
    },
    {
      field: 'userNumber',
      sortable: true,
      title: '{system.views.tenant.manager.title.subscribe.userNumber}',
      width: 120,
    },
    {
      ...getTableUseYnColumnClass(),
      width: 120,
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
export const getSubscribeFormSchemas = (
  tenantIdRef: ComputedRef<number | undefined>,
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
      fieldName: 'isAdd',
      label: '',
      component: 'Switch',
      dependencies: {
        triggerFields: ['isAdd'],
        show: false,
      },
    },
    {
      fieldName: 'packageId',
      label: t('system.views.tenant.manager.title.subscribe.packageId'),
      component: 'SmartPulldownTable',
      dependencies: {
        triggerFields: ['packageId'],
        disabled: (value) => {
          const isAdd = value.isAdd;
          return isAdd === false;
        },
      },
      componentProps: () => {
        return {
          alwaysLoad: false,
          immediate: false,
          showFunction: (row: any) => `${row.packageCode}-${row.packageName}`,
          valueField: 'id',
          showHeader: true,
          pulldownProps: {
            destroyOnClose: false,
          },
          async api() {
            const tenantId = unref(tenantIdRef);
            if (!tenantId) {
              return [];
            }
            return listNoBindPackageByTenantIdApi({
              id: tenantId,
            });
          },
          tableProps: {
            border: true,
            columns: [
              {
                field: 'packageCode',
                sortable: true,
                title: '123',
                width: 120,
              },
              {
                field: 'packageName',
                title: '{system.views.tenant.package.title.packageName}',
                width: 120,
              },
              {
                field: 'effectTime',
                sortable: true,
                title: '{system.views.tenant.package.title.effectTime}',
                width: 165,
              },
              {
                field: 'expireTime',
                sortable: true,
                title: '{system.views.tenant.package.title.expireTime}',
                width: 165,
              },
              {
                field: 'remark',
                title: '{common.table.remark}',
                minWidth: 120,
              },
              {
                ...getTableUseYnColumnClass(),
                width: 120,
              },
            ],
          },
        };
      },
    },
    {
      fieldName: 'times',
      label: t('system.views.tenant.manager.title.subscribe.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
      rules: 'required',
    },

    {
      fieldName: 'userNumber',
      label: t('system.views.tenant.manager.title.subscribe.userNumber'),
      component: 'InputNumber',
      componentProps: {},
      rules: 'required',
      defaultValue: 1000,
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {},
    },
  ];
};
