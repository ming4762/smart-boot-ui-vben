<script setup lang="ts">
import { computed, unref, watch } from 'vue';

import { useAccess } from '@vben/access';

import { useSmartTable } from '#/adapter/smart-table';

import {
  batchSaveUpdateSubscribeApi,
  getSubscribeByIdApi,
  listSubscribeApi,
  setSubscribeUseYnApi,
} from '../SysTenantListView.api';
import {
  getSubscribeFormSchemas,
  getSubscribeTableColumns,
  Permission,
} from '../SysTenantListView.config';

interface Props {
  tenantId?: number;
}

const props = defineProps<Props>();

const { hasAccessByAuth } = useAccess();

const computedChoseTenant = computed(() => props.tenantId !== undefined);

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-tenant-manager-subscribeList',
  columns: getSubscribeTableColumns(),
  height: 'auto',
  customConfig: { storage: true },
  stripe: true,
  border: true,
  sortConfig: {
    remote: true,
  },
  checkboxConfig: true,
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: false,
  addEditConfig: {
    formConfig: {
      schema: getSubscribeFormSchemas(computed(() => props.tenantId)),
    },
  },
  proxyConfig: {
    ajax: {
      query: async (params) => {
        const tenantId = props.tenantId;
        if (!tenantId) {
          return [];
        }
        return listSubscribeApi({
          ...params.ajaxParameter,
          tenantId,
        });
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const dataList = [...insertRecords, ...updateRecords];
        dataList.forEach((item) => {
          const times = item.times as Array<Date> | undefined;
          if (times && times.length > 0) {
            item.effectTime = times[0];
            item.expireTime = times[1];
          }
          item.tenantId = props.tenantId;
        });
        return batchSaveUpdateSubscribeApi(dataList);
      },
      getById: async (params) => {
        const data = await getSubscribeByIdApi(params.id);
        if (data && data.effectTime && data.expireTime) {
          data.times = [data.effectTime, data.expireTime];
        }
        return data;
      },
      useYn: setSubscribeUseYnApi,
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    column: {
      columnOrder: true,
    },
    buttons: [
      {
        code: 'ModalAdd',
        props: computed(() => {
          return {
            disabled:
              !unref(computedChoseTenant) ||
              !hasAccessByAuth(Permission.subscribeAddUpdate),
          };
        }),
      },
      {
        code: 'ModalEdit',
        auth: Permission.subscribeAddUpdate,
      },
      {
        code: 'delete',
        auth: Permission.subscribeDelete,
      },
      {
        code: 'useYnTrue',
        auth: Permission.subscribeSetUseYn,
      },
      {
        code: 'useYnFalse',
        auth: Permission.subscribeSetUseYn,
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
  <div class="h-full">
    <SmartTable />
  </div>
</template>

<style scoped></style>
