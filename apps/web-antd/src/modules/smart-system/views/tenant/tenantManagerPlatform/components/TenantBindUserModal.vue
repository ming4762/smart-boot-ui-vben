<script setup lang="ts">
import { nextTick, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { uniqueByField } from '@vben/utils';

import { useSmartTable } from '#/adapter/smart-table';
import { SmartAuthButton } from '#/components';
import { successMessage, warnMessage } from '#/utils';

import {
  bindTenantUserApi,
  listNoBindUserApi,
} from '../SysTenantManagerPlatformView.api';
import {
  getBindUserModalListColumns,
  getTabUserListSearchSchemas,
  Permission,
} from '../SysTenantManagerPlatformView.confg';

const emit = defineEmits(['afterBind']);

const tenantIdRef = ref<null | number>(null);

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-tenant-manager-add-user',
  columns: getBindUserModalListColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
  },
  stripe: true,
  customConfig: { storage: true },
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    keyField: 'userId',
  },
  checkboxConfig: {
    rowTrigger: 'multiple',
    highlight: true,
    reserve: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getTabUserListSearchSchemas(),
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 70,
    },
    searchWithSymbol: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query({ ajaxParameter }) {
        return listNoBindUserApi({
          ...ajaxParameter,
          tenantId: unref(tenantIdRef),
        });
      },
    },
  },
});

const [Modal, modalAPi] = useVbenModal({
  title: t('system.views.tenant.manager.title.tabUser'),
  destroyOnClose: false,
  confirmText: t('system.views.tenant.manager.button.user.bind'),
  onOpenChange: (isOpen) => {
    if (!isOpen) {
      return;
    }
    const { tenantId } = modalAPi.getData();
    tenantIdRef.value = tenantId;
    nextTick(() => {
      if (tableApi.isMounted) {
        tableApi.getGrid().clearData();
        tableApi.query();
        tableApi.getGrid().clearCheckboxRow();
      }
    });
  },
  onConfirm: () => {
    handleBindUser(false);
  },
});

const handleTableInitialized = () => {
  tableApi.getGrid().clearData();
  tableApi.query();
  tableApi.getGrid().clearCheckboxRow();
};

const bindLoadingRef = ref(false);
/**
 * 绑定用户
 * @param createAccount 是否创建账户
 */
const handleBindUser = async (createAccount: boolean) => {
  const tableInstance = tableApi.getGrid();
  const selectRows = [
    ...(tableInstance.getCheckboxRecords() || []),
    ...(tableInstance.getCheckboxReserveRecords() || []),
  ];
  const userIdList = uniqueByField(selectRows, 'userId').map(
    (row) => row.userId,
  );
  if (userIdList.length === 0) {
    warnMessage(t('system.views.tenant.manager.message.selectUser'));
    return false;
  }
  try {
    bindLoadingRef.value = true;
    modalAPi.setState({ confirmLoading: true });
    await bindTenantUserApi({
      userIdList,
      createAccount,
      tenantId: unref(tenantIdRef),
    });
    successMessage(t('system.views.tenant.manager.message.bindUserSuccess'));
    modalAPi.close();
    emit('afterBind');
  } finally {
    modalAPi.setState({ confirmLoading: false });
    bindLoadingRef.value = false;
  }
};
</script>

<template>
  <Modal class="system-tenant-manager-addUserModal">
    <SmartTable @initialized="handleTableInitialized" />
    <template #center-footer>
      <SmartAuthButton
        type="primary"
        :loading="bindLoadingRef"
        @click="() => handleBindUser(true)"
        :auth="Permission.bindUser"
      >
        {{ t('system.views.tenant.manager.button.user.bindAndCreateAccount') }}
      </SmartAuthButton>
    </template>
  </Modal>
</template>

<style lang="less">
.system-tenant-manager-addUserModal {
  width: 1000px;
  height: 700px;
  .scrollbar__view {
    display: flex;

    & > div:first-child {
      width: 100%;
    }
  }
}
</style>
