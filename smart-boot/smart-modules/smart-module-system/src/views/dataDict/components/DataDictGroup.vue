<script setup lang="ts">
import { useSmartTable } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  deleteDictApi,
  getByIdDictApi,
  listDictApi,
  saveUpdateDictApi,
} from '../DataDictListView.api';
import {
  getDataDictGroupAddEditSchemas,
  getDataDictGroupColumns,
  getDataDictGroupSearchSchemas,
} from '../DataDictListView.config';

const emit = defineEmits<{ codeChange: [number] }>();

const { getIsPlatformTenant } = useUserStore();

const handleCurrentChange = ({ row }: any) => {
  emit('codeChange', row.id);
};

const [SmartTable] = useSmartTable({
  id: 'system-dataDict',
  columns: getDataDictGroupColumns(),
  border: true,
  height: 'auto',
  stripe: true,
  customConfig: { storage: true },
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  pagerConfig: true,
  useSearchForm: true,
  sortConfig: {
    remote: true,
    defaultSort: { field: 'seq', order: 'asc' },
  },
  checkboxConfig: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    searchWithSymbol: true,
    schema: getDataDictGroupSearchSchemas(),
    commonConfig: {
      formItemClass: 'pb-2',
      labelWidth: 90,
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getDataDictGroupAddEditSchemas(getIsPlatformTenant),
    },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        const parameter = {
          sortName: 'seq',
          ...ajaxParameter,
        };
        return listDictApi(parameter);
      },
      save: ({ body: { insertRecords, updateRecords } }) =>
        saveUpdateDictApi([...insertRecords, ...updateRecords][0]),
      delete: ({ body: { removeRecords } }) => deleteDictApi(removeRecords),
      getById: (params) => getByIdDictApi(params.id),
    },
  },
  columnConfig: {
    resizable: true,
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    sizeSetting: true,
    custom: true,
    buttons: [{ code: 'ModalAdd' }, { code: 'ModalEdit' }, { code: 'delete' }],
  },
});
</script>

<template>
  <div class="smart-table-padding mr-[5px] h-full">
    <SmartTable @current-change="handleCurrentChange" />
  </div>
</template>

<style scoped></style>
