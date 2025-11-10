import type { ComputedRef, Ref } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';
import type {
  SmartSearchFormSchema,
  SmartTableColumn,
} from '#/adapter/smart-table';

import { unref } from 'vue';

import { $t as t } from '@vben/locales';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
} from '#/adapter/smart-table';
import { listNoBindPackageByTenantIdApi } from '#/modules/smart-system/views/tenant/tenantManager/SysTenantListView.api';

import { listDeptTreeByTenantApi } from './SysTenantManagerPlatformView.api';

export interface SysTenantProps {
  tenantId?: number | string;
  activated?: boolean;
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
      formatter: 'datetime',
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
  tenantIdRef: ComputedRef<number | string | undefined>,
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
        triggerFields: ['isAdd'],
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
            useSearchForm: false,
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
                formatter: 'datetime',
              },
              {
                field: 'expireTime',
                sortable: true,
                title: '{system.views.tenant.package.title.expireTime}',
                width: 165,
                formatter: 'datetime',
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
      formatter: 'datetime',
    },
    {
      field: 'expireTime',
      sortable: true,
      title: '{system.views.tenant.manager.title.subscribe.expireTime}',
      width: 165,
      formatter: 'datetime',
    },
    {
      field: 'status',
      title: '生效状态',
      width: 100,
      align: 'center',
      formatter: ({ row }) => {
        const { effectStatus } = row;
        if (effectStatus === 'pending_effect') {
          return '待生效';
        }
        if (effectStatus === 'expired') {
          return '已失效';
        }
        return '生效中';
      },
      dynamicClass: ({ row }) => {
        const { effectStatus } = row;
        if (effectStatus === 'pending_effect') {
          return 'text-color--warning-bold';
        }
        if (effectStatus === 'expired') {
          return 'text-color--danger-bold';
        }
        return 'text-color--success-bold';
      },
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
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
  ];
};

export const getRoleTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.role.table.roleName}',
      field: 'roleName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.role.table.roleCode}',
      field: 'roleCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: '{system.views.role.table.superAdminYn}',
      field: 'superAdminYn',
      width: 120,
      ...getTableBooleanColumnClass('superAdminYn'),
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      minWidth: 160,
    },
    {
      title: '{common.table.seq}',
      field: 'seq',
      width: 100,
      sortable: true,
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      title: '{common.table.createUser}',
      field: 'createBy',
      width: 120,
    },
    {
      title: '{common.table.updateTime}',
      field: 'updateTime',
      width: 165,
      sortable: true,
      formatter: 'datetime',
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
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

export const getRoleAddEditFormSchemas = (): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'roleId',
      component: 'Input',
      dependencies: {
        triggerFields: ['roleId'],
        show: false,
      },
    },
    {
      label: t('system.views.role.table.roleCode'),
      fieldName: 'roleCode',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.role.table.roleName'),
      fieldName: 'roleName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('common.title.useYn'),
      fieldName: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('system.views.role.table.roleType'),
      fieldName: 'roleType',
      component: 'Input',
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'InputNumber',
      rules: 'required',
      defaultValue: 1,
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

/**
 * 租户管理 添加修改用户表单
 */
export const getAddEditUserFormSchemas = (
  tenantIdRef: Ref<number | string | undefined>,
): VbenFormSchema[] => {
  return [
    {
      label: '',
      fieldName: 'userId',
      component: 'Input',
      dependencies: {
        triggerFields: ['id'],
        show: false,
      },
    },
    {
      label: t('system.views.user.table.username'),
      fieldName: 'username',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.user.table.fullName'),
      fieldName: 'fullName',
      component: 'Input',
      rules: 'required',
    },
    {
      label: t('system.views.user.table.email'),
      fieldName: 'email',
      component: 'Input',
    },
    {
      label: t('system.views.user.table.mobile'),
      fieldName: 'mobile',
      component: 'Input',
    },
    {
      label: t('common.table.seq'),
      fieldName: 'seq',
      component: 'Input',
      rules: 'required',
      defaultValue: 1,
      componentProps: {
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.form.dept'),
      fieldName: 'deptIdList',
      component: 'ApiTreeSelect',
      controlClass: 'w-full',
      componentProps: {
        showSearch: true,
        multiple: true,
        api: () => listDeptTreeByTenantApi(unref(tenantIdRef)),
        allowClear: true,
        childrenField: 'children',
        labelField: 'deptName',
        valueField: 'deptId',
        placeholder: t('system.views.user.validate.selectDept'),
      },
    },
  ];
};
