import type { ComputedRef } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

import { getTableUseYnColumnClass } from '#/adapter/smart-table';
import { listNoBindPackageByTenantIdApi } from '#/modules/smart-system/views/tenant/tenantManager/SysTenantListView.api';

export interface SysTenantProps {
  tenantId?: number;
}

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
      type: 'dateTime',
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
      type: 'dateTime',
    },
    {
      field: 'expireTime',
      sortable: true,
      title: '{system.views.tenant.manager.title.subscribe.expireTime}',
      width: 165,
      type: 'dateTime',
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
      type: 'dateTime',
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
