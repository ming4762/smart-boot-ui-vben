<script setup lang="ts">
import type { SubscriptionManagementAdapter } from '../../../../permission-management/types';
import type { SysTenantProps } from '../SysTenantManagerPlatformView.confg';

import { computed, toRefs } from 'vue';

import { useSmartTable } from '@vben/common-ui';
import { useTabLazy } from '@vben/hooks';
import { zonedDayjs } from '@vben/utils';

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
  Permission as localPermissions,
} from '../SysTenantManagerPlatformView.confg';

/** 本地租户页面与 IAM 客户端页面共用订阅面板。 */
interface Props extends SysTenantProps {
  adapter?: SubscriptionManagementAdapter;
}

const props = defineProps<Props>();
const Permission = props.adapter?.permissions ?? localPermissions;
const adapter = props.adapter ?? {
  list: listSubscribeApi,
  save: batchSaveUpdateSubscribeApi,
  get: (row: any) => getSubscribeByIdApi(row.id),
  setUseYn: setSubscribeUseYnApi,
  remove: (rows: any[]) => cancelTenantSubscribeApi(rows.map((row) => row.id)),
};

const { tenantId: tenantIdRef, activated } = toRefs(props);

/**
 * 监控当前tab是否激活
 * 激活时，自动查询数据
 */
useTabLazy(tenantIdRef, activated, () => tableApi.query());

const [SmartTable, tableApi] = useSmartTable({
  id: props.adapter?.scopeKey ?? 'system-tenant-subscribeList',
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
      schema: getSubscribeFormSchemas(computed(() => props.tenantId), props.adapter?.listPackages),
    },
  },
  proxyConfig: {
    ajax: {
      query: async (params) => {
        const tenantId = props.tenantId;
        if (!tenantId) {
          return [];
        }
        const dataList = await adapter.list({
          ...params.ajaxParameter,
          tenantId,
        });
        if (!dataList || dataList.length === 0) {
          return [];
        }
        const currentTime = zonedDayjs();
        return dataList.map((item: any) => {
          const { effectTime, expireTime } = item;
          const effectTimeDayjs = zonedDayjs(effectTime);
          const expireTimeDayjs = zonedDayjs(expireTime);
          let effectStatus;
          if (currentTime.isBefore(effectTimeDayjs)) {
            effectStatus = 'pending_effect';
          } else if (currentTime.isAfter(expireTimeDayjs)) {
            effectStatus = 'expired';
          } else {
            effectStatus = 'in_effect';
          }
          return {
            ...item,
            effectStatus,
          };
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
        return adapter.save(dataList);
      },
      getById: async (params) => {
        const data = await adapter.get(params);
        if (data && data.effectTime && data.expireTime) {
          data.times = [
            zonedDayjs(data.effectTime),
            zonedDayjs(data.expireTime),
          ];
        }
        return data;
      },
      useYn: adapter.setUseYn,
      delete: ({ body: { removeRecords } }) =>
        adapter.remove(removeRecords),
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
</script>

<template>
  <div class="h-full">
    <SmartTable />
  </div>
</template>

<style scoped></style>

