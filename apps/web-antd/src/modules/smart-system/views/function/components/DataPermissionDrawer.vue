<script setup lang="ts">
import { nextTick, ref, unref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import { useSmartTable } from '#/adapter/smart-table';

import { Permission } from '../FunctionListView.config';
import {
  deleteApi,
  getByIdApi,
  listApi,
  saveApi,
  setUseYnApi,
  updateApi,
} from './SysDataPermissionListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
} from './SysDataPermissionListView.config';

const currentFunctionIdRef = ref<null | number>(null);

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: (open) => {
    if (open) {
      const { functionId } = drawerApi.getData();
      currentFunctionIdRef.value = functionId;
    }
  },
  onOpened: () => {
    nextTick(() => {
      tableApi.query();
    });
  },
  class: 'w-[800px]',
  footer: false,
});

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
  },
  showOverflow: 'tooltip',
  checkboxConfig: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
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
          maxWidth: '120px',
        },
      },
      labelWidth: 70,
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-1 grid',
    },
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ ajaxParameter }) => {
        if (!unref(currentFunctionIdRef)) {
          return [];
        }
        return listApi({
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'functionId@=': unref(currentFunctionIdRef),
          },
        });
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        const dataList = [...insertRecords, ...updateRecords].map((item) => {
          return {
            ...item,
            functionId: unref(currentFunctionIdRef),
          };
        });
        if (dataList.length > 1) {
          throw new Error('不支持批量保存');
        }
        if (insertRecords.length > 0) {
          return saveApi(dataList[0]);
        }
        if (updateRecords.length > 0) {
          return updateApi(dataList[0]);
        }
        return Promise.resolve();
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
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
        auth: Permission.add,
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
        auth: Permission.useYn,
      },
      {
        code: 'useYnFalse',
        auth: Permission.useYn,
      },
    ],
  },
});
</script>

<template>
  <Drawer title="数据权限">
    <div class="h-full">
      <SmartTable :size="getTableSize as never" />
    </div>
  </Drawer>
</template>

<style scoped></style>
