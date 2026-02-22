<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { unref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';

import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from '../UserGroupListView.api';
import {
  getAddEditFormSchemas,
  getSearchSchemas,
  getTableColumns,
  Permission,
} from '../UserGroupListView.config';

interface Props {
  groupId?: number | string;
}
const props = defineProps<Props>();

const router = useRouter();

const permissions = Permission;

const goTo = (groupId?: number | string) => {
  const currentRoute = unref(router.currentRoute);
  const query = {
    ...currentRoute.query,
    groupId,
  };
  router.push({
    path: currentRoute.path,
    query,
  });
};

const setCurrentRow = () => {
  const groupId = props.groupId;
  tableApi.getGrid()?.clearCurrentRow();
  tableApi.getGrid()?.clearCheckboxRow();
  if (groupId) {
    const row = tableApi.getGrid().getRowById(groupId);
    if (!row) {
      goTo();
    }
    tableApi.getGrid()?.setCurrentRow({ groupId });
    tableApi.getGrid()?.setCheckboxRow({ groupId }, true);
  }
};
watch(
  () => props.groupId,
  () => {
    setCurrentRow();
  },
);

const [SmartTable, tableApi] = useSmartTable({
  id: 'sys_user_group_list',
  columns: getTableColumns(),
  height: 'auto',
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'groupId',
  },
  customConfig: { storage: true },
  pagerConfig: true,
  checkboxConfig: true,
  useSearchForm: true,
  border: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    schema: getSearchSchemas(),
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
    searchWithSymbol: true,
  },
  addEditConfig: {
    formConfig: {
      schema: getAddEditFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => listApi(ajaxParameter),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (data) => getByIdApi(data),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      useYn: setUseYnApi,
    },
  },
  columnConfig: {
    resizable: true,
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    sizeSetting: true,
    showSearch: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: permissions.add,
      },
      {
        code: 'delete',
        auth: permissions.delete,
      },
      {
        code: 'useYnTrue',
        auth: permissions.useYn,
      },
      {
        code: 'useYnFalse',
        auth: permissions.useYn,
      },
    ],
  },
});

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      auth: permissions.update,
      onClick: () => tableApi.editByRowModal(row),
    },
    // {
    //   label: t('system.views.userGroup.button.setUser'),
    //   auth: permissions.setUser,
    //   onClick: () => {
    //     handleShowSetUser(row);
    //   },
    // },
  ];
};

const handleCurrentChange = ({ row }: any) => {
  goTo(row.groupId);
};

const handleAfterQuery = () => {
  setCurrentRow();
};
</script>

<template>
  <SmartTable
    @proxy-query="handleAfterQuery"
    class="smart-table-padding"
    @current-change="handleCurrentChange"
  >
    <template #table-operation="{ row }">
      <SmartVxeTableAction :actions="getTableActions(row)" />
    </template>
  </SmartTable>
</template>

<style scoped></style>
