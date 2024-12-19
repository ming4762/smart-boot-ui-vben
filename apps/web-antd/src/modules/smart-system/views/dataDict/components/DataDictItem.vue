<script setup lang="ts">
import { watch } from 'vue';

import { useSmartTable } from '#/adapter/smart-table';

import {
  batchSaveUpdateDictItemApi,
  deleteDictItemApi,
  getByIdDictItemApi,
  listDictItemApi,
} from '../DataDictListView.api';
import {
  getDataDictItemAddEditSchemas,
  getDataDictItemColumns,
} from '../DataDictListView.config';

interface Props {
  dictId?: number;
}

const props = defineProps<Props>();

const [SmartTable, tableApi] = useSmartTable({
  columns: getDataDictItemColumns(),
  border: true,
  height: 'auto',
  stripe: true,
  rowConfig: {
    isHover: true,
  },
  pagerConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getDataDictItemAddEditSchemas(),
    },
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ({ ajaxParameter }) => {
        const parameter = {
          sortName: 'seq',
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'dictId@=': props.dictId,
          },
        };
        return listDictItemApi(parameter);
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        insertRecords.forEach((item) => (item.dictId = props.dictId));
        return batchSaveUpdateDictItemApi([...insertRecords, ...updateRecords]);
      },
      delete: ({ body: { removeRecords } }) => deleteDictItemApi(removeRecords),
      getById: (params) => getByIdDictItemApi(params),
    },
  },
  columnConfig: {
    resizable: true,
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    sizeSetting: true,
    column: true,
    buttons: [{ code: 'ModalAdd' }, { code: 'ModalEdit' }, { code: 'delete' }],
  },
});

watch(
  () => props.dictId,
  (value) => {
    if (value) {
      tableApi.query();
    }
  },
);
</script>

<template>
  <div class="h-full">
    <SmartTable />
  </div>
</template>

<style scoped></style>
