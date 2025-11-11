<script setup lang="ts">
import type { ExtendSmartTableApi } from '@vben/common-ui';

import { computed, unref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { useSmartTable, useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import {
  createConfirm,
  successMessage,
  warnMessage,
} from '@smart/common/utils';

import {
  createTenantUserAccountApi,
  listTenantUserApi,
  removeBindUserApi,
} from '../SysTenantListView.api';
import {
  getTabUserListColumns,
  getTabUserListSearchSchemas,
  Permission,
} from '../SysTenantListView.config';
import TenantAddUserModal from './TenantAddUserModal.vue';

interface Props {
  tenantId?: number;
}

const props = defineProps<Props>();

const { getIsPlatformTenant } = useUserStore();
const { hasAccessByAuth } = useAccess();

const computedChoseTenant = computed(() => props.tenantId !== undefined);

const [RenderTenantAddUserModal, modalApi] = useVbenModal({
  connectedComponent: TenantAddUserModal,
});

const handleCreateAccount = (tableApi: ExtendSmartTableApi) => {
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

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-tenant-manager-userList',
  columns: getTabUserListColumns(),
  border: true,
  height: 'auto',
  customConfig: { storage: true },
  sortConfig: {
    remote: true,
  },
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
          onClick: () => handleCreateAccount(tableApi),
        },
      },
    ],
  },
});

watch(
  () => props.tenantId,
  () => tableApi.query(),
);
</script>

<template>
  <div class="system-tenant-manager-userTab h-full">
    <SmartTable />
    <RenderTenantAddUserModal @after-bind="tableApi.query" />
  </div>
</template>

<style lang="less" scoped>
.system-tenant-manager-userTab {
  :deep(.smart-search-container) {
    padding: 5px 10px 0;
  }
}
</style>
