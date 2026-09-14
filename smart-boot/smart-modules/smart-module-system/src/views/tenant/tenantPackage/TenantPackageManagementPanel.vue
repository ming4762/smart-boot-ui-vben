<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { PackageManagementAdapter } from '../../../permission-management/types';

import { ref } from 'vue';

import { ResizableLayout, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { zonedDayjs } from '@vben/utils';

import FunctionGrantPanel from '../../../permission-management/FunctionGrantPanel.vue';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SysTenantPackageListView.config';

/** 可复用管理面板；父级切换范围时通过 key 销毁旧实例。 */
const props = defineProps<{ adapter: PackageManagementAdapter }>();
const adapter = props.adapter;
const Permission = adapter.permissions;

const { getTableSize } = useSizeSetting();

const currentPackage = ref<null | Recordable<any>>(null);
const handleCurrentChange = ({ row }: any) => {
  currentPackage.value = row;
};

const [SmartTable] = useSmartTable({
  id: adapter.scopeKey,
  columns: getTableColumns(),
  customConfig: { storage: true },
  height: 'auto',
  border: true,
  stripe: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
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
  pagerConfig: adapter.paged,
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 80,
      formItemClass: 'pb-2',
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => {
        currentPackage.value = null;
        return adapter.list(params.ajaxParameter ?? {});
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const dataList = [...insertRecords, ...updateRecords];
        dataList.forEach((item) => {
          const times = item.times as Array<Date> | undefined;
          if (times && times.length > 0) {
            item.effectTime = times[0];
            item.expireTime = times[1];
          }
        });
        return adapter.save(dataList);
      },
      delete: ({ body: { removeRecords } }) => adapter.remove(removeRecords),
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
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permission.save,
      },
      {
        code: 'ModalEdit',
        auth: Permission.update,
      },
      {
        code: 'delete',
        auth: Permission.delete,
      },
      {
        code: 'useYnTrue',
        auth: Permission.setUseYn,
      },
      {
        code: 'useYnFalse',
        auth: Permission.setUseYn,
      },
    ],
  },
});
</script>

<template>
  <div class="page-container h-full">
    <ResizableLayout
      class="h-full"
      divider-size="5px"
      resize-mode="preview"
      resizable
      :second-size="240"
      size-unit="px"
    >
      <template #first>
        <SmartTable
          class="smart-table-padding"
          @current-change="handleCurrentChange"
          :size="getTableSize as never"
        />
      </template>
      <template #second>
        <FunctionGrantPanel
          :adapter="adapter.grant"
          :resource-id="currentPackage?.id"
        />
      </template>
    </ResizableLayout>
  </div>
</template>

<style scoped></style>
