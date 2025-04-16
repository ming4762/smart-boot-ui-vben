<script setup lang="ts">
import type { SysTenantProps } from '../SysTenantManagerPlatformView.confg';

import { computed, ref, toRefs, unref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { useSmartTable } from '#/adapter/smart-table';
import { SmartAuthButton } from '#/components';
import { deleteUserByIdApi } from '#/modules/smart-system/api/UserApi';
import { createTenantUserAccountApi } from '#/modules/smart-system/views/tenant/tenantManager/SysTenantListView.api';
import { createConfirm, successMessage, warnMessage } from '#/utils';

import {
  getUserByTenantIdWithDeptApi,
  listTenantUserApi,
  removeBindUserApi,
  saveTenantUserApi,
} from '../SysTenantManagerPlatformView.api';
import {
  getAddEditUserFormSchemas,
  getTabUserListColumns,
  getTabUserListSearchSchemas,
  Permission,
} from '../SysTenantManagerPlatformView.confg';
import TenantBindUserModal from './TenantBindUserModal.vue';

interface Props extends SysTenantProps {}

const props = defineProps<Props>();
const { tenantId: tenantIdRef } = toRefs(props);

const { hasAccessByAuth } = useAccess();
const { getIsPlatformTenant } = useUserStore();

const computedChoseTenant = computed(() => props.tenantId !== undefined);

const [RenderTenantBindUserModal, modalApi] = useVbenModal({
  connectedComponent: TenantBindUserModal,
});

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-tenant-userList',
  border: true,
  height: 'auto',
  customConfig: { storage: true },
  columns: getTabUserListColumns(),
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  checkboxConfig: true,
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getTabUserListSearchSchemas(),
    wrapperClass: 'flex',
    actionWrapperClass: 'text-left col-span-1 pb-2 ml-1.5',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 70,
      formItemClass: 'pb-2',
    },
  },
  addEditConfig: {
    modalConfig: {
      class: 'w-[700px]',
      slots: {
        'center-footer': 'save-and-create-account',
      },
    },
    formConfig: {
      schema: getAddEditUserFormSchemas(tenantIdRef),
    },
  },
  proxyConfig: {
    ajax: {
      async query({ ajaxParameter }) {
        const tenantId = props.tenantId;
        if (!tenantId) {
          return {
            rows: [],
            total: 0,
          };
        }
        return listTenantUserApi({
          ...ajaxParameter,
          tenantId,
        });
      },
      delete({ body: { removeRecords } }) {
        const userIdList = removeRecords.map((item) => item.userId);
        return deleteUserByIdApi(props.tenantId, userIdList);
      },
      save({ body: { insertRecords, updateRecords } }) {
        const dataList = [...insertRecords, ...updateRecords];
        if (dataList.length > 1) {
          throw new Error('不支持批量操作');
        }
        return saveTenantUserApi({
          ...dataList[0],
          tenantId: props.tenantId,
          createAccount: false,
        });
      },
      getById(params: any): Promise<any> {
        return getUserByTenantIdWithDeptApi(props.tenantId!, params.userId);
      },
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    buttons: [
      {
        code: 'ModalAdd',
        props: computed(() => {
          return {
            onClick: () => {
              if (!props.tenantId) {
                warnMessage(
                  t('system.views.tenant.manager.message.selectTenant'),
                );
                return false;
              }
              tableApi.showAddModal();
            },
          };
        }),
      },
      {
        code: 'ModalEdit',
      },
      {
        name: t('system.views.tenant.manager.button.user.bind'),
        customRender: 'ant',
        auth: Permission.bindUser,
        props: {
          type: 'primary',
          preIcon: 'ant-design:plus-outlined',
          onClick: () => {
            if (!props.tenantId) {
              warnMessage(
                t('system.views.tenant.manager.message.selectTenant'),
              );
              return false;
            }
            modalApi.setData({
              tenantId: props.tenantId,
            });
            modalApi.open();
          },
        },
      },
      {
        name: t('system.views.tenant.manager.button.user.unBind'),
        customRender: 'ant',
        props: {
          type: 'primary',
          danger: true,
          preIcon: 'ant-design:close-outlined',
          onClick: () => handleRemoveBind(),
        },
      },
      {
        name: t('system.views.tenant.manager.button.user.createAccount'),
        customRender: 'ant',
        visible: unref(getIsPlatformTenant),
        props: {
          type: 'primary',
          preIcon: 'ant-design:user-add-outlined',
          onClick: () => handleCreateAccount(),
        },
      },
      {
        code: 'delete',
        props: computed(() => {
          return {
            disabled:
              !unref(computedChoseTenant) ||
              !hasAccessByAuth(Permission.bindUser),
          };
        }),
      },
    ],
  },
});

const handleCreateAccount = () => {
  const selectRows = tableApi.getGrid().getCheckboxRecords();
  if (selectRows.length === 0) {
    warnMessage(t('system.views.tenant.manager.message.selectUser'));
    return false;
  }
  // 验证是否已经存在创建账户的
  const createAccountList = selectRows.filter(
    (item) => item.accountId === null,
  );
  if (createAccountList.length === 0) {
    warnMessage(t('system.views.tenant.manager.message.noCreateAccountUser'));
    return false;
  }
  let i18nKey = 'system.views.tenant.manager.message.createAccountConfirm';
  if (createAccountList.length < selectRows.length) {
    i18nKey = 'system.views.tenant.manager.message.hasCreateAccount';
  }
  createConfirm({
    content: t(i18nKey),
    iconType: 'warning',
    async onOk() {
      await createTenantUserAccountApi({
        tenantId: props.tenantId,
        userIdList: createAccountList.map((item) => item.userId),
      });
      successMessage(
        t('system.views.tenant.manager.message.createAccountSuccess'),
      );
      tableApi.query();
    },
  });
};

watch(
  () => props.tenantId,
  () => tableApi.query(),
);

/**
 * 解绑用户
 */
const handleRemoveBind = () => {
  const selectRows = tableApi.getGrid().getCheckboxRecords();
  if (selectRows.length === 0) {
    warnMessage(t('system.views.tenant.manager.message.selectUser'));
    return false;
  }
  createConfirm({
    content: t('system.views.tenant.manager.message.unbindConfirm'),
    iconType: 'warning',
    async onOk() {
      await removeBindUserApi({
        userIdList: selectRows.map((item) => item.userId),
        tenantId: props.tenantId,
      });
      tableApi.query();
    },
  });
};

/**
 * 保存用户并创建账户
 */
const userSaveLoadingRef = ref(false);
const handleSaveCreateAccount = async () => {
  const addEditModalApi = tableApi.getAddEditModal();
  const addEditFormApi = tableApi.getAddEditForm()!;
  const { valid } = await addEditFormApi.validate();
  if (!valid) {
    return false;
  }
  try {
    addEditModalApi.setState({ confirmLoading: true });
    userSaveLoadingRef.value = true;
    const formData = await addEditFormApi.getValues();
    await saveTenantUserApi({
      ...formData,
      tenantId: props.tenantId,
      createAccount: true,
    });
    successMessage(t('common.message.operationSucceeded'));
    tableApi.query();
    addEditModalApi.close();
  } finally {
    addEditModalApi.setState({ confirmLoading: false });
    userSaveLoadingRef.value = false;
  }
};
</script>

<template>
  <div class="tenant-user-container h-full">
    <SmartTable>
      <template #save-and-create-account="{ isAdd }">
        <SmartAuthButton
          v-if="isAdd"
          :loading="userSaveLoadingRef"
          @click="handleSaveCreateAccount"
          type="primary"
        >
          {{ t('system.views.user.button.saveAndCreateAccount') }}
        </SmartAuthButton>
      </template>
    </SmartTable>
    <RenderTenantBindUserModal @after-bind="tableApi.query" />
  </div>
</template>

<style lang="less" scoped>
.tenant-user-container {
  background: hsl(var(--background-deep));
}
</style>
