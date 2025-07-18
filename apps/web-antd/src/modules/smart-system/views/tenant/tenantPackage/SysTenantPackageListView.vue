<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { zonedDayjs } from '@vben/utils';

import { useSmartTable } from '#/adapter/smart-table';

import TenantPackageSetFunction from './components/TenantPackageSetFunction.vue';
import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from './SysTenantPackageListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permission,
} from './SysTenantPackageListView.config';

const { getTableSize } = useSizeSetting();

const currentPackage = ref<null | Recordable<any>>(null);
const handleCurrentChange = ({ row }: any) => {
  currentPackage.value = row;
};

const [SmartTable] = useSmartTable({
  id: 'smart-system-tenant-package-list-table',
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
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
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
        return listApi(params.ajaxParameter);
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
        return batchSaveUpdateApi(dataList);
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const data = await getByIdApi(params.id);
        if (data && data.effectTime && data.expireTime) {
          data.times = [
            zonedDayjs(data.effectTime),
            zonedDayjs(data.expireTime),
          ];
        }
        return data;
      },
      useYn: setUseYnApi,
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
  <div class="smart-table-padding page-container h-full">
    <SmartLayoutSeparate class="h-full" draggable second-size="240px">
      <template #first>
        <SmartTable
          @current-change="handleCurrentChange"
          :size="getTableSize as never"
        />
      </template>
      <template #second>
        <TenantPackageSetFunction :tenant-package-id="currentPackage?.id" />
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped></style>
