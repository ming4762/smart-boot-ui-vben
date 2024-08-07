import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { tableUseYnClass, tableBooleanClass } from '@/components/SmartTable';
import { Ref, unref } from 'vue';

import { listNoBindPackageByTenantIdApi } from './SysTenantListView.api';

export enum Permission {
  save = 'sys:tenant:manager:save',
  update = 'sys:tenant:manager:update',
  delete = 'sys:tenant:manager:delete',
  useYn = 'sys:tenant:manager:setUseYn',
  bindUser = 'sys:tenant:manager:bindUser',
  subscribeAddUpdate = 'sys:tenant:manager:subscribe:addUpdate',
  subscribeDelete = 'sys:tenant:manager:subscribe:delete',
  subscribeSetUseYn = 'sys:tenant:manager:subscribe:setUseYn',
}

export const SYSTEM_TENANT_TYPE_DICT = 'SYSTEM_TENANT_TYPE';
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
      ...tableBooleanClass('platformYn'),
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
      ...tableUseYnClass(),
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
export const getFormSchemas = (t: Function, isolationStrategyListRef: Ref): FormSchema[] => {
  return [
    {
      field: 'id',
      show: false,
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'tenantCode',
      label: t('system.views.tenant.manager.title.tenantCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'tenantName',
      label: t('system.views.tenant.manager.title.tenantName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'tenantShortName',
      label: t('system.views.tenant.manager.title.tenantShortName'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'type',
      label: t('system.views.tenant.manager.title.type'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: SYSTEM_TENANT_TYPE_DICT,
        labelWithCode: true,
      },
      required: true,
      defaultValue: '10',
    },
    {
      field: 'contacts',
      label: t('system.views.tenant.manager.title.contacts'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'contactPhone',
      label: t('system.views.tenant.manager.title.contactPhone'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'email',
      label: t('system.views.tenant.manager.title.email'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'isolationStrategy',
      label: t('system.views.tenant.manager.title.isolationStrategy'),
      component: 'Select',
      componentProps: () => {
        return {
          options: unref(isolationStrategyListRef),
        };
      },
      required: true,
    },
    {
      field: 'industry',
      label: t('system.views.tenant.manager.title.industry'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'domain',
      label: t('system.views.tenant.manager.title.domain'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'availableUserNum',
      label: t('system.views.tenant.manager.title.availableUserNum'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'region',
      label: t('system.views.tenant.manager.title.region'),
      component: 'Cascader',
      componentProps: {},
    },
    {
      field: 'effectExpireTime',
      label: t('system.views.tenant.manager.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'Input',
      componentProps: {},
      defaultValue: 1,
    },
    {
      field: 'address',
      label: t('system.views.tenant.manager.title.address'),
      component: 'InputTextArea',
      componentProps: {},
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
      componentProps: {},
    },
    {
      field: 'logoId',
      label: t('system.views.tenant.manager.title.logoId'),
      component: 'Input',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'tenantCode',
      label: t('system.views.tenant.manager.title.tenantCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'tenantName',
      label: t('system.views.tenant.manager.title.tenantName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'tenantShortName',
      label: t('system.views.tenant.manager.title.tenantShortName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'type',
      label: t('system.views.tenant.manager.title.type'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'isolationStrategy',
      label: t('system.views.tenant.manager.title.isolationStrategy'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'effectTime',
      label: t('system.views.tenant.manager.title.effectTime'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'expireTime',
      label: t('system.views.tenant.manager.title.expireTime'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};

/**
 * 绑定用户tab
 */
export const getTabUserListColumns = (t: Function): SmartColumn[] => {
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
          return t('common.form.yes');
        }
        return t('common.form.no');
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

export const getTabUserListSearchSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'username',
      label: t('system.views.tenant.manager.title.user.username'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'fullName',
      label: t('system.views.tenant.manager.title.user.fullName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};

/**
 * 绑定用户modal
 */
export const getBindUserModalListColumns = (): SmartColumn[] => {
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

export const getSubscribeTableColumns = (): SmartColumn[] => {
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
      ...tableUseYnClass(),
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
export const getSubscribeFormSchemas = (t: Function, tenantIdRef: Ref): FormSchema[] => {
  return [
    {
      field: 'id',
      label: '',
      component: 'Input',
      show: false,
      componentProps: {},
    },
    {
      field: 'isAdd',
      label: '',
      component: 'Switch',
      show: false,
    },
    {
      field: 'packageId',
      label: t('system.views.tenant.manager.title.subscribe.packageId'),
      component: 'SmartPulldownTable',
      dynamicDisabled({ model }) {
        const isAdd = model.isAdd;
        return isAdd === false;
      },
      componentProps: () => {
        return {
          alwaysLoad: true,
          transfer: true,
          showFunction: (row) => `${row.packageCode}-${row.packageName}`,
          valueField: 'id',
          tableProps: {
            border: true,
            columns: [
              {
                field: 'packageCode',
                sortable: true,
                title: '{system.views.tenant.package.title.packageCode}',
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
                ...tableUseYnClass(),
                width: 120,
              },
            ],
            proxyConfig: {
              ajax: {
                async query({ ajaxParameter }) {
                  const tenantId = unref(tenantIdRef);
                  if (!tenantId) {
                    return [];
                  }
                  return listNoBindPackageByTenantIdApi({
                    ...ajaxParameter,
                    id: tenantId,
                  });
                },
              },
            },
          },
        };
      },
    },
    {
      field: 'times',
      label: t('system.views.tenant.manager.title.subscribe.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
      required: true,
    },

    {
      field: 'userNumber',
      label: t('system.views.tenant.manager.title.subscribe.userNumber'),
      component: 'InputNumber',
      componentProps: {},
      required: true,
      defaultValue: 1000,
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
      componentProps: {},
    },
  ];
};
