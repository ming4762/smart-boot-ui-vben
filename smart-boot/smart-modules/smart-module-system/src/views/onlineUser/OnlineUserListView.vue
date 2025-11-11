<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { createConfirm, successMessage } from '@smart/common/utils';
import { SysTenantSelect } from '@smart/components';
import { storeToRefs } from 'pinia';

import { listOnlineUserApi, offlineApi } from './OnlineUserListView.api';
import {
  getSearchFormSchemas,
  getTableColumns,
  getTableExpandColumns,
} from './OnlineUserListView.config';

const { getIsPlatformTenant } = storeToRefs(useUserStore());

const [SmartTable, tableApi] = useSmartTable({
  border: true,
  height: 'auto',
  columns: getTableColumns(),
  useSearchForm: true,
  rowConfig: {
    isHover: true,
  },
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    schema: getSearchFormSchemas(getIsPlatformTenant),
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
    },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => listOnlineUserApi(ajaxParameter),
    },
  },
  columnConfig: {
    resizable: true,
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    sizeSetting: true,
  },
});

const [InnerSmartTable] = useSmartTable({
  columns: getTableExpandColumns(),
  useSearchForm: false,
  border: true,
  stripe: true,
  showOverflow: 'tooltip',
});

/**
 * 执行登出操作
 * @param username 用户名
 * @param token token
 */
const handleOffline = (username?: string, token?: string) => {
  createConfirm({
    content: t('system.views.onlineUser.message.offlineConfirm'),
    onOk: async () => {
      await offlineApi(username, token);
      successMessage(t('system.views.onlineUser.message.offlineSuccess'));
      tableApi.query();
    },
  });
};

const getTableActions = (
  row: any,
  isExpand: boolean,
): SmartTableActionItem[] => {
  return [
    {
      label: t('system.views.onlineUser.button.offline'),
      auth: 'sys:auth:offline',
      danger: true,
      onClick: () => {
        handleOffline(
          isExpand ? null : row.username,
          isExpand ? row.token : null,
        );
      },
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable>
      <template #table-expand="{ row }">
        <InnerSmartTable :data="row.userLoginDataList" class="expand-wrapper">
          <template #expand-table-operation="data">
            <SmartVxeTableAction :actions="getTableActions(data.row, true)" />
          </template>
        </InnerSmartTable>
      </template>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row, false)" />
      </template>
      <template #search-tenantId="{ model, size }">
        <SysTenantSelect
          v-model:value="model.tenantId"
          :size="size"
          allow-clear
          style="width: 100px"
        />
      </template>
    </SmartTable>
  </div>
</template>

<style scoped>
.expand-wrapper {
  padding: 10px 0;
}
</style>
