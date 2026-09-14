<script lang="ts" setup>
import { useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { convertToTimezone, zonedDayjs } from '@vben/utils';

import {
  createApi,
  deleteApi,
  getByIdApi,
  listApi,
  updateApi,
} from './SysReleaseNoteListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from './SysReleaseNoteListView.config';

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
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
  pagerConfig: true,
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
      labelWidth: 70,
    },
  },
  addEditConfig: {
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-1 grid',
    },
    modalConfig: {
      destroyOnClose: false,
      fullscreen: true,
      onOpened() {
        tableApi.getAddEditForm()?.setFieldValue('logTime', zonedDayjs());
      },
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) => {
        if (insertRecords.length > 0) {
          return createApi(insertRecords[0]);
        }
        if (updateRecords.length > 0) {
          return updateApi(updateRecords[0]);
        }
        return Promise.resolve();
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const data = await getByIdApi(params.id);
        if (!data) {
          return data;
        }
        return convertToTimezone(data, ['logTime']);
      },
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
        auth: Permissions.create,
      },
      {
        code: 'ModalEdit',
        auth: Permissions.update,
      },
      {
        code: 'delete',
        auth: Permissions.delete,
      },
    ],
  },
});
</script>

<template>
  <div class="page-container smart-table-padding h-full">
    <SmartTable :size="getTableSize as never" />
  </div>
</template>
