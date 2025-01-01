<script lang="ts" setup>
import { $t as t } from '@vben/locales';

import {
  type SmartTableActionItem,
  SmartVxeTableAction,
  useSmartTable,
} from '#/adapter/smart-table';

import { useSetUser } from './hooks/useSetUser';
import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from './UserGroupListView.api';
import {
  getAddEditFormSchemas,
  getSearchSchemas,
  getTableColumns,
  Permission,
} from './UserGroupListView.config';

const permissions = Permission;
const {
  SelectUserModal,
  handleShowSetUser,
  handleUserSelected,
  selectUserList,
} = useSetUser(t);

const [SmartTable, tableApi] = useSmartTable({
  id: 'sys_user_group',
  columns: getTableColumns(),
  height: 'auto',
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
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
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
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
    {
      label: t('system.views.userGroup.button.setUser'),
      auth: permissions.setUser,
      onClick: () => {
        handleShowSetUser(row);
      },
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
    <SelectUserModal
      :select-values="selectUserList"
      class="w-[1200px]"
      show-select
      @selected="handleUserSelected"
    />
  </div>
</template>

<style lang="less" scoped></style>
