<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from './SmartMessageTemplateListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from './SmartMessageTemplateListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-message-template',
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  sortConfig: {
    remote: true,
  },
  pagerConfig: true,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  checkboxConfig: true,
  showOverflow: 'tooltip',
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    compact: true,
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
  },
  addEditConfig: {
    modalConfig: {
      fullscreen: true,
    },
    formConfig: {
      schema: getFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
      useYn(rows: any[], useYn: boolean) {
        const idList = rows.map((item) => item.id);
        return setUseYnApi({
          useYn,
          idList,
        });
      },
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    sizeSetting: true,
    custom: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permissions.save,
      },
      {
        code: 'delete',
        auth: Permissions.delete,
      },
      {
        code: 'useYnTrue',
        auth: Permissions.update,
      },
      {
        code: 'useYnFalse',
        auth: Permissions.update,
      },
    ],
  },
});

const getActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      onClick: () => {
        tableApi.editByRowModal(row);
      },
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartTable :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
