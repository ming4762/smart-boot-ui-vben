import type { ComputedRef } from 'vue';

import type { SmartSearchFormSchema, SmartTableColumn } from '@vben/common-ui';

import type { VbenFormSchema } from '#/adapter/form';

import { unref } from 'vue';

import {
  getTableBooleanColumnClass,
  getTableUseYnColumnClass,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { getDeptTreeListApi } from './UserListView.api';

/**
 * 数据权限
 */
const DATA_SCOPE = [
  { key: 'DATA_ALL', value: 'system.views.user.title.dataAll' },
  { key: 'DATA_DEPT', value: 'system.views.user.title.dataDept' },
  { key: 'DATA_DEPT_AND_CHILD', value: 'system.views.user.title.dataDeptAll' },
  { key: 'DATA_PERSONAL', value: 'system.views.user.title.dataPersonal' },
];

export const Permission = {
  add: 'sys:user:save',
  delete: 'sys:user:delete',
  update: 'sys:user:update',
  setRole: 'sys:user:setRole',
  useYn: 'sys:user:setUseYn',
  createAccount: 'sys:account:add',
  unlockUserAccount: 'sys:user:unlockUserAccount',
  unlockPassword: 'sys:user:resetPassword',
};

/**
 * 系统用户标识
 */
export const SYS_USER_TYPE = 'SYSTEM_USER';

export const getTableColumns = (): SmartTableColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.accountStatus}',
      field: 'account',
      width: 100,
      slots: {
        default: 'table-accountStatus',
      },
    },
    {
      title: '{system.views.user.table.buildIn}',
      width: 80,
      ...getTableBooleanColumnClass('buildIn'),
      sortable: true,
    },
    {
      title: '{system.views.user.table.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.user.table.mobile}',
      field: 'mobile',
      minWidth: 140,
    },
    {
      ...getTableUseYnColumnClass(),
      sortable: true,
    },
    // {
    //   ...tableDeleteYn(t).createColumn(),
    //   sortable: true,
    // },
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
      type: 'dateTime',
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
      type: 'dateTime',
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
      width: 120,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 180,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getAddEditFormSchemas = (): VbenFormSchema[] => {
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
      fieldName: 'deptId',
      component: 'ApiTreeSelect',
      dependencies: {
        triggerFields: ['userType'],
        disabled: (value) => {
          return value.userType === SYS_USER_TYPE;
        },
      },
      controlClass: 'w-full',
      componentProps: {
        showSearch: true,
        api: getDeptTreeListApi,
        allowClear: true,
        childrenField: 'children',
        labelField: 'deptName',
        valueField: 'deptId',
        placeholder: t('system.views.user.validate.selectDept'),
      },
    },
    {
      label: t('system.views.user.form.dataScope'),
      fieldName: 'dataScopeList',
      component: 'Select',
      dependencies: {
        triggerFields: ['userType', 'deptId', 'dataScopeList'],
        disabled: (value) => {
          return value.userType === SYS_USER_TYPE;
        },
        rules: (value) => {
          const { userType, deptId } = value;
          const required =
            userType !== SYS_USER_TYPE &&
            deptId !== undefined &&
            deptId !== null;
          return required ? 'required' : null;
        },
      },
      defaultValue: [],
      componentProps: {
        style: {
          width: '100%',
        },
        mode: 'multiple',
        options: DATA_SCOPE.map((item) => {
          return {
            label: t(item.value),
            value: item.key,
          };
        }),
      },
    },
  ];
};

export const getSearchSchemas = (): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.user.table.username'),
      fieldName: 'username',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.username'),
      },
    },
    {
      label: t('system.views.user.table.fullName'),
      fieldName: 'fullName',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.fullName'),
      },
    },
    {
      label: t('system.views.user.table.email'),
      fieldName: 'email',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.email'),
      },
    },
    {
      label: t('common.title.useYn'),
      fieldName: 'useYn',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        style: {
          width: '100px',
        },
        options: [
          {
            label: 'Y',
            value: 1,
          },
          {
            label: 'N',
            value: 0,
          },
        ],
      },
    },
  ];
};

/**
 * 获取账户表单项
 * @param computedHasEditPermission
 */
export const getAccountFormSchemas = (
  computedHasEditPermission: ComputedRef<boolean>,
): VbenFormSchema[] => {
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
      label: t('system.views.user.account.maxConnections'),
      fieldName: 'maxConnections',
      component: 'InputNumber',
      labelWidth: 204,
      formItemClass: 'mr-[10px]',
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.account.maxDaysSinceLogin'),
      fieldName: 'maxDaysSinceLogin',
      component: 'InputNumber',
      labelWidth: 246,
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.account.passwordLifeDays'),
      fieldName: 'passwordLifeDays',
      component: 'InputNumber',
      formItemClass: 'mr-[10px]',
      labelWidth: 204,
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.account.maxConnectionsPolicy'),
      fieldName: 'maxConnectionsPolicy',
      component: 'Select',
      labelWidth: 246,
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        options: [
          {
            label: t('system.views.user.account.loginNotAllow'),
            value: 'LOGIN_NOT_ALLOW',
          },
          {
            label: t('system.views.user.account.firstUserLogout'),
            value: 'FIRST_USER_LOGOUT',
          },
        ],
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.account.loginFailTimeLimit'),
      fieldName: 'loginFailTimeLimit',
      component: 'InputNumber',
      formItemClass: 'mr-[10px]',
      labelWidth: 204,
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.account.passwordErrorUnlockSecond'),
      fieldName: 'passwordErrorUnlockSecond',
      component: 'InputNumber',
      labelWidth: 400,
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.account.ipWhiteList'),
      fieldName: 'ipWhiteList',
      component: 'Textarea',
      formItemClass: 'mr-[10px]',
      labelWidth: 204,
      componentProps: {
        disabled: !unref(computedHasEditPermission),
        rows: 4,
      },
    },
  ];
};
