<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { ref, watch } from 'vue';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
} from '../SysParameterListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from '../SysParameterListView.config';

const emit = defineEmits(['change']);

const currentRowRef = ref<any>(null);
watch(currentRowRef, (value) => {
  emit('change', value);
});
const handleCurrentChange = ({ row }: any) => {
  currentRowRef.value = row;
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-sysParameter',
  height: 'auto',
  useSearchForm: true,
  border: true,
  stripe: true,
  sortConfig: {
    remote: true,
    defaultSort: { field: 'seq', order: 'asc' },
  },
  pagerConfig: true,
  checkboxConfig: true,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  showOverflow: 'tooltip',
  columns: getTableColumns(),
  searchFormConfig: {
    searchWithSymbol: true,
    schema: getSearchFormSchemas(),
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
    compact: true,
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(t),
      commonConfig: {
        // formItemClass: 'pb-2',
      },
    },
  },
  proxyConfig: {
    ajax: {
      query: async (params) => {
        currentRowRef.value = null;
        return listApi(params.ajaxParameter);
      },
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
    },
  },
  customConfig: { storage: true },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    custom: true,
    sizeSetting: true,
    showSearch: true,
    buttons: [{ code: 'ModalAdd' }, { code: 'ModalEdit' }, { code: 'delete' }],
  },
});

const getActions = (row: any) => {
  const { buildIn } = row;
  const result: SmartTableActionItem[] = [
    {
      code: 'edit',
      auth: buildIn ? Permissions.updateBuildIn : Permissions.update,
      onClick: () => {
        tableApi.editByRowModal(row);
      },
    },
  ];
  if (!buildIn) {
    result.push({
      code: 'delete',
      auth: Permissions.delete,
      danger: true,
      onClick: () => {
        tableApi.deleteByRow(row);
      },
    });
  }
  return result;
};
</script>

<template>
  <SmartTable @current-change="handleCurrentChange" class="smart-table-padding">
    <template #table-operation="{ row }">
      <SmartVxeTableAction :actions="getActions(row)" />
    </template>
  </SmartTable>
</template>

<style scoped></style>
