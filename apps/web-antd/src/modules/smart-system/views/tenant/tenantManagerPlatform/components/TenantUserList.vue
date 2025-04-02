<script setup lang="ts">
import type { SysTenantProps } from '../SysTenantManagerPlatformView.confg';

import { computed, unref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { useSmartTable } from '#/adapter/smart-table';
import { createTenantUserAccountApi } from '#/modules/smart-system/views/tenant/tenantManager/SysTenantListView.api';
import { Permission } from '#/modules/smart-system/views/tenant/tenantManager/SysTenantListView.config';
import { createConfirm, successMessage, warnMessage } from '#/utils';

import {
  listTenantUserApi,
  removeBindUserApi,
} from '../SysTenantManagerPlatformView.api';
import {
  getTabUserListColumns,
  getTabUserListSearchSchemas,
} from '../SysTenantManagerPlatformView.confg';
import TenantAddUserModal from './TenantAddUserModal.vue';

interface Props extends SysTenantProps {}

const props = defineProps<Props>();

const { hasAccessByAuth } = useAccess();
const { getIsPlatformTenant } = useUserStore();

const computedChoseTenant = computed(() => props.tenantId !== undefined);

const [RenderTenantAddUserModal, modalApi] = useVbenModal({
  connectedComponent: TenantAddUserModal,
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
        return removeBindUserApi({
          userIdList,
          tenantId: props.tenantId,
        });
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
              modalApi.setData({
                tenantId: props.tenantId,
              });
              modalApi.open();
            },
            disabled:
              !unref(computedChoseTenant) ||
              !hasAccessByAuth(Permission.bindUser),
          };
        }),
      },
      {
        name: t('system.views.tenant.manager.button.user.bind'),
        customRender: 'ant',
        props: {
          type: 'primary',
          preIcon: 'ant-design:plus-outlined',
          onClick: () => {
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
        code: 'delete',
        props: computed(() => {
          return {
            disabled:
              !unref(computedChoseTenant) ||
              !hasAccessByAuth(Permission.bindUser),
          };
        }),
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
</script>

<template>
  <div class="tenant-user-container h-full">
    <SmartTable />
    <RenderTenantAddUserModal @after-bind="tableApi.query" />
  </div>
</template>

<style lang="less" scoped>
.tenant-user-container {
  background: hsl(var(--background-deep));
}
</style>
