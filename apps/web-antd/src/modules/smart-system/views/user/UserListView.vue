<script setup lang="ts">
import type {
  ExtendSmartTableApi,
  SmartTableActionItem,
} from '@vben/common-ui';

import { ref, unref } from 'vue';

import { useAccess } from '@vben/access';
import {
  SmartLayoutSeparate,
  SmartVxeTableAction,
  useVbenModal,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { useClipboard } from '@vueuse/core';
import { Tooltip } from 'ant-design-vue';

import { useSmartTable } from '#/adapter/smart-table';
import { SmartAuthButton, SysDeptTree } from '#/components';
import {
  createConfirm,
  errorMessage,
  successMessage,
  warnMessage,
} from '#/utils';

import UserAccountUpdate from './components/UserAccountUpdateModal.vue';
import UserSetRole from './components/UserSetRoleModal.vue';
import UserUseYn from './components/UserUseYnModal.vue';
import {
  createAccountApi,
  deleteApi,
  getUserByIdWithDeptApi,
  listApi,
  resetPassword,
  saveAndCreateAccountApi,
  saveUpdateWithDeptApi,
  setUseYnApi,
  unlockUserAccountApi,
} from './UserListView.api';
import {
  getAddEditFormSchemas,
  getSearchSchemas,
  getTableColumns,
  Permission,
  SYS_USER_TYPE,
} from './UserListView.config';

const { hasAccessByAuth } = useAccess();
const { getIsPlatformTenant } = useUserStore();
const { copy } = useClipboard({ legacy: true });

const [UserSetRoleModal, useSetRoleModalApi] = useVbenModal({
  connectedComponent: UserSetRole,
});

const [UserUseYnModal, userUseYnModalApi] = useVbenModal({
  connectedComponent: UserUseYn,
});

const [UserAccountUpdateModal, userAccountModalApi] = useVbenModal({
  connectedComponent: UserAccountUpdate,
});

/**
 * 选中组织架构操作
 * @param selectedKeys
 */
const currentDeptId = ref<null | number | undefined>(null);

const hasPermissionUpdateSystemUser = hasAccessByAuth('sys:systemUser:update');
const hasSystemUserUpdate = (type: string) => {
  return hasPermissionUpdateSystemUser || type !== SYS_USER_TYPE;
};

/**
 * 创建账户
 */
const handleCreateAccount = (tableApi: ExtendSmartTableApi) => {
  const userList = tableApi.getGrid().getCheckboxRecords(false);
  if (userList.length === 0) {
    warnMessage({
      message: t('system.views.user.validate.selectUser'),
    });
    return false;
  }
  if (!hasPermissionUpdateSystemUser) {
    // 如果没有修改系统用户的权限，判断用户中是否有系统用户
    const hasSysUser = userList.some(
      ({ userType }: any) => userType === SYS_USER_TYPE,
    );
    if (hasSysUser) {
      errorMessage(t('system.views.user.validate.noSysUserUpdatePermission'));
      return false;
    }
  }
  // 判断是否有停用用户
  const hasNoUse = userList.some((item) => item.useYn === false);
  if (hasNoUse) {
    warnMessage(t('system.views.user.message.noUseUserNotCreateAccount'));
    return false;
  }
  createConfirm({
    iconType: 'warning',
    title: t('system.views.user.validate.createAccountConfirm'),
    onOk: async () => {
      await createAccountApi(userList);
      successMessage(t('common.message.operationSucceeded'));
      tableApi.query();
    },
  });
};

/**
 * 用户操作验证
 * @param userList
 */
const validateOperateUser = (userList: Array<any>) => {
  if (userList.length === 0) {
    warnMessage({
      message: t('system.views.user.validate.selectUser'),
    });
    return false;
  }
  if (!hasPermissionUpdateSystemUser) {
    // 如果没有修改系统用户的权限，判断用户中是否有系统用户
    const hasSysUser = userList.some(
      ({ userType }: any) => userType === SYS_USER_TYPE,
    );
    if (hasSysUser) {
      errorMessage(t('system.views.user.validate.noSysUserUpdatePermission'));
      return false;
    }
  }
  return true;
};

const validateSelectRows = (tableApi: ExtendSmartTableApi) => {
  const rows = tableApi.getGrid().getCheckboxRecords();
  if (rows.length === 0) {
    warnMessage(t('common.notice.select'));
    return false;
  }
  return rows;
};

/**
 * 保存并创建账户
 */
const saveAndCreateAccountLoadingRef = ref(false);
const handleSaveAndCreateAccount = async () => {
  const addEditModalApi = tableApi.getAddEditModal();
  const addEditFormApi = tableApi.getAddEditForm()!;
  const { valid } = await addEditFormApi.validate();
  if (!valid) {
    return false;
  }
  try {
    addEditModalApi.setState({ confirmLoading: true });
    saveAndCreateAccountLoadingRef.value = true;
    const formData = await addEditFormApi.getValues();
    await saveAndCreateAccountApi(formData);
    successMessage(t('common.message.operationSucceeded'));
    tableApi.query();
    addEditModalApi.close();
  } finally {
    addEditModalApi.setState({ confirmLoading: false });
    saveAndCreateAccountLoadingRef.value = false;
  }
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-sys-user-list-view',
  customConfig: { storage: true },
  columns: getTableColumns(),
  stripe: true,
  height: 'auto',
  border: true,
  align: 'left',
  rowConfig: {
    isHover: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  checkboxConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  showOverflow: 'tooltip',
  searchFormConfig: {
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex',
    schema: getSearchSchemas(),
    commonConfig: {
      componentProps: {
        // style: {
        //   maxWidth: '150px',
        // },
      },
      labelWidth: 70,
      formItemClass: 'pb-2',
    },
    searchWithSymbol: true,
  },
  addEditConfig: {
    modalConfig: {
      class: 'w-[700px]',
      slots: {
        'center-footer': 'save-and-create-account',
      },
    },
    formConfig: {
      schema: getAddEditFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        const parameter = {
          ...ajaxParameter,
        };
        const deptId = unref(currentDeptId);
        if (deptId) {
          parameter.deptIdList = [deptId];
        }
        return listApi(parameter);
      },
      delete: deleteApi,
      save: saveUpdateWithDeptApi,
      getById: getUserByIdWithDeptApi,
      useYn: setUseYnApi,
    },
  },
  toolbarConfig: {
    refresh: true,
    resizable: true,
    custom: true,
    sizeSetting: true,
    zoom: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permission.add,
        props: {
          onClick: () => {
            tableApi.showAddModal({}, { deptId: unref(currentDeptId) });
          },
        },
      },
      {
        name: t('system.views.user.button.createAccount'),
        customRender: 'ant',
        auth: Permission.createAccount,
        props: {
          onClick: () => handleCreateAccount(tableApi),
          type: 'primary',
        },
      },
      {
        code: 'delete',
        props: {
          onClick: () => {
            const userList = tableApi.getGrid().getCheckboxRecords(false);
            // 验证用户
            const result = validateOperateUser(userList);
            if (!result) {
              return false;
            }
            // 验证是否包含系统用户
            const sysUserValidate = userList.some(
              (item: any) => item.userType === SYS_USER_TYPE,
            );
            if (sysUserValidate) {
              errorMessage(t('system.views.user.validate.sysUserNoDelete'));
              return false;
            }
            // 执行删除操作
            tableApi.deleteByCheckbox();
          },
        },
      },
      {
        code: 'useYnTrue',
        props: {
          onClick() {
            if (unref(getIsPlatformTenant)) {
              const rows = validateSelectRows(tableApi);
              if (!rows) {
                return false;
              }
              userUseYnModalApi.setData({ rows, useYn: true });
              userUseYnModalApi.open();
            } else {
              tableApi.setUseYnByCheckbox(true);
            }
          },
        },
      },
      {
        code: 'useYnFalse',
        props: {
          onClick() {
            if (unref(getIsPlatformTenant)) {
              const rows = validateSelectRows(tableApi);
              if (!rows) {
                return false;
              }
              userUseYnModalApi.setData({ rows, useYn: false });
              userUseYnModalApi.open();
            } else {
              tableApi.setUseYnByCheckbox(true);
            }
          },
        },
      },
      {
        name: t('system.views.user.button.resetPassword'),
        auth: Permission.unlockPassword,
        customRender: 'ant',
        props: {
          type: 'primary',
          preIcon: 'ant-design:unlock-outlined',
          onClick: () => {
            const selectRows = tableApi.getGrid().getCheckboxRecords(false);
            if (selectRows.length !== 1) {
              warnMessage('请选择一条数据');
              return;
            }
            createConfirm({
              iconType: 'warning',
              title: t('system.views.user.button.resetPassword'),
              content: t('system.views.user.validate.resetPassword'),
              onOk: async () => {
                const newPassword = await resetPassword(selectRows[0].userId);
                createConfirm({
                  iconType: 'warning',
                  okText: t('system.views.user.button.copyPassword'),
                  onOk: () => {
                    copy(newPassword);
                    successMessage(t('common.message.copySuccess'));
                  },
                  title: t('system.views.user.message.resetSavePassword'),
                  content: newPassword,
                });
              },
            });
          },
        },
      },
      {
        name: t('system.views.user.button.setRole'),
        auth: Permission.setRole,
        customRender: 'ant',
        props: {
          type: 'primary',
          preIcon: 'ant-design:team-outlined',
          onClick: () => {
            const selectRows = tableApi.getGrid().getCheckboxRecords(false);
            if (selectRows.length !== 1) {
              warnMessage('请选择一条数据');
              return;
            }
            useSetRoleModalApi.setData({
              userId: selectRows[0].userId,
            });
            useSetRoleModalApi.open();
          },
        },
      },
    ],
  },
});

const handleDeptSelected = (selectedKeys: Array<number>) => {
  currentDeptId.value = selectedKeys.length > 0 ? selectedKeys[0] : null;
  // 重新加载数据
  tableApi.query();
};

const handleUnlockUserAccount = (id: number) => {
  createConfirm({
    iconType: 'warning',
    content: t('system.views.user.message.confirmUnlockUserAccount'),
    onOk: async () => {
      await unlockUserAccountApi(id);
      successMessage(t('system.views.user.message.unlockUserAccountSuccess'));
      await tableApi.query();
    },
  });
};

/**
 * table行按钮
 */
const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      onClick: () => tableApi.editByRowModal(row),
      disabled:
        !hasAccessByAuth(Permission.update) ||
        !hasSystemUserUpdate(row.userType),
    },
    {
      label: t('system.views.user.button.showAccount'),
      disabled:
        !hasAccessByAuth('sys:account:query') ||
        !hasSystemUserUpdate(row.userType),
      onClick: () => {
        userAccountModalApi.setData(row);
        userAccountModalApi.open();
      },
    },
    {
      label: t('system.views.user.button.unlockUserAccount'),
      auth: Permission.unlockUserAccount,
      disabled:
        !hasAccessByAuth(Permission.unlockUserAccount) ||
        !row.userAccount ||
        (row.userAccount && row.userAccount.accountStatus === 'NORMAL'),
      onClick: () => handleUnlockUserAccount(row.userId),
    },
  ];
};

const accountLockedMessage: { [index: string]: string } = {
  LOGIN_FAIL_LOCKED: '多次登录失败锁定',
  LONG_TIME_LOCKED: '超出指定时间未登录锁定',
  LONG_TIME_PASSWORD_MODIFY_LOCKED: '超出指定时间未修改密码锁定',
};
const getLockedMessage = (status: null | string | undefined) => {
  if (!status || status === 'NORMAL') {
    return '正常';
  }
  return accountLockedMessage[status];
};

/**
 * 账户状态
 */
const accountStatusMap = {
  empty: {
    label: '未创建',
    color: '#A9A9A9',
  },
  NORMAL: {
    label: '正常',
    color: '#228B22',
  },
  LOCKED: {
    label: '锁定',
    color: 'red',
  },
};
const getAccountData = (status: null | string | undefined) => {
  if (status === undefined || status === null) {
    return accountStatusMap.empty;
  }
  if (status === 'NORMAL') {
    return accountStatusMap.NORMAL;
  }
  return accountStatusMap.LOCKED;
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate class="h-full" draggable first-size="280px">
      <template #first>
        <div class="dept-container bg-background h-full">
          <SysDeptTree async show-search @select="handleDeptSelected" />
        </div>
      </template>
      <template #second>
        <SmartTable class="smart-table-padding">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getTableActions(row)" />
          </template>
          <template #table-accountStatus="{ row }">
            <Tooltip :title="getLockedMessage(row.userAccount?.accountStatus)">
              <span
                :style="{
                  color: getAccountData(row.userAccount?.accountStatus).color,
                  fontWeight: 'bold',
                }"
              >
                {{ getAccountData(row.userAccount?.accountStatus).label }}
              </span>
            </Tooltip>
          </template>
          <template #save-and-create-account="{ isAdd }">
            <SmartAuthButton
              type="primary"
              @click="handleSaveAndCreateAccount"
              :auth="Permission.createAccount"
              :loading="saveAndCreateAccountLoadingRef"
              v-if="isAdd"
            >
              {{ t('system.views.user.button.saveAndCreateAccount') }}
            </SmartAuthButton>
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
    <UserSetRoleModal />
    <UserUseYnModal />
    <UserAccountUpdateModal />
  </div>
</template>

<style scoped>
.dept-container {
  padding: 10px;
}
</style>
