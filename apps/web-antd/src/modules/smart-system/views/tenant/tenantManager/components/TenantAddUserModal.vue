<script setup lang="ts">
import { ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { uniqueByField } from '@vben/utils';

import { useSmartTable } from '#/adapter/smart-table';
import { successMessage, warnMessage } from '#/utils';

import { bindTenantUserApi, listNoBindUserApi } from '../SysTenantListView.api';
import {
  getBindUserModalListColumns,
  getTabUserListSearchSchemas,
} from '../SysTenantListView.config';

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
    isCurrent: true,
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
  onOpened: () => {
    const { tenantId } = modalAPi.getData();
    tenantIdRef.value = tenantId;
    tableApi.query();
    tableApi.getGrid().clearCheckboxRow();
  },
  onConfirm: async () => {
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
      modalAPi.setState({ confirmLoading: true });
      await bindTenantUserApi({
        userIdList,
        tenantId: unref(tenantIdRef),
      });
      successMessage(t('system.views.tenant.manager.message.bindUserSuccess'));
      modalAPi.close();
      emit('afterBind');
    } finally {
      modalAPi.setState({ confirmLoading: false });
    }
  },
});
</script>

<template>
  <Modal class="system-tenant-manager-addUserModal">
    <SmartTable />
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
