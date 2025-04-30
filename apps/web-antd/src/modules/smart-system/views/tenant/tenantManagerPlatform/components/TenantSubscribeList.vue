<script setup lang="ts">
import type { SysTenantProps } from '../SysTenantManagerPlatformView.confg';

import { computed, watch } from 'vue';

import { zonedDayjs } from '@vben/utils';

import { useSmartTable } from '#/adapter/smart-table';

import {
  batchSaveUpdateSubscribeApi,
  cancelTenantSubscribeApi,
  getSubscribeByIdApi,
  listSubscribeApi,
  setSubscribeUseYnApi,
} from '../SysTenantManagerPlatformView.api';
import {
  getSubscribeFormSchemas,
  getSubscribeTableColumns,
  Permission,
} from '../SysTenantManagerPlatformView.confg';

interface Props extends SysTenantProps {}

const props = defineProps<Props>();

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-tenant-subscribeList',
  columns: getSubscribeTableColumns(),
  height: 'auto',
  customConfig: { storage: true },
  useSearchForm: false,
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
          data.times = [
            zonedDayjs(data.effectTime),
            zonedDayjs(data.expireTime),
          ];
        }
        return data;
      },
      useYn: setSubscribeUseYnApi,
      delete: ({ body: { removeRecords } }) =>
        cancelTenantSubscribeApi(removeRecords.map((item) => item.id)),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permission.subscribeAddUpdate,
      },
      {
        code: 'ModalEdit',
        auth: Permission.subscribeAddUpdate,
      },
      {
        code: 'delete',
        name: '取消订阅',
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
