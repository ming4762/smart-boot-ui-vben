import {
  SmartColumn,
  SmartSearchFormSchema,
  tableBooleanClass,
  tableUseYnClass,
} from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

import { DATA_SCOPE, SYS_USER_TYPE } from '@/modules/smart-system/constants/SystemConstants';

import { getDeptTreeListApi } from './UserListView.api';

export const getTableColumns = (): SmartColumn[] => {
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
      ...tableBooleanClass('buildIn'),
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
      ...tableUseYnClass(),
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

export const getAddEditFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'userId',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.user.table.username'),
      field: 'username',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.user.table.fullName'),
      field: 'fullName',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.user.table.email'),
      field: 'email',
      component: 'Input',
    },
    {
      label: t('system.views.user.table.mobile'),
      field: 'mobile',
      component: 'Input',
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'Input',
      required: true,
      defaultValue: 1,
      componentProps: {
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('system.views.user.form.dept'),
      field: 'deptId',
      component: 'ApiTreeSelect',
      dynamicDisabled: ({ model }) => {
        return model.userType === SYS_USER_TYPE;
      },
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
      field: 'dataScopeList',
      component: 'Select',
      dynamicDisabled: ({ model }) => {
        return model.userType === SYS_USER_TYPE;
      },
      dynamicRules: ({ model }) => {
        const { userType, deptId } = model;
        const required = userType !== SYS_USER_TYPE && deptId !== undefined && deptId !== null;
        return [
          {
            required,
            message: t('system.views.user.validate.selectDataScope'),
          },
        ];
      },
      defaultValue: [],
      componentProps: {
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

export const getSearchSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.user.table.username'),
      field: 'username',
      component: 'Input',
      colProps: {
        // span: 3,
      },
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.username'),
      },
    },
    {
      label: t('system.views.user.table.fullName'),
      field: 'fullName',
      component: 'Input',
      colProps: {
        // span: 3,
      },
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.fullName'),
      },
    },
    {
      label: t('system.views.user.table.email'),
      field: 'email',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        placeholder: t('system.views.user.table.email'),
      },
    },
    {
      label: t('common.table.useYn'),
      field: 'useYn',
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
