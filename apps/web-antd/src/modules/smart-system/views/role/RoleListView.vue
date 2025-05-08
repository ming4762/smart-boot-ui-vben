<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { SmartLayoutSeparate, SmartVxeTableAction } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { TabPane, Tabs } from 'ant-design-vue';

import { useSmartTable } from '#/adapter/smart-table';
import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  listUserByRoleIdApi,
  setRoleUserApi,
} from '#/modules/smart-system/views/role/RoleListView.api';

import RoleDataPermission from './components/RoleDataPermission.vue';
import RoleSetFunction from './components/RoleSetFunction.vue';
import { useRoleSetUser } from './hook/useRoleSetUser';
import {
  getAddEditFormSchemas,
  getSearchSchemas,
  getTableColumns,
  Permission,
} from './RoleListView.config';

const currentRow = ref<Recordable<any>>({});
const handleCurrentChange = ({ row }: any) => {
  currentRow.value = row;
};

const { handleShowSetUser, SelectUserModal } = useRoleSetUser(
  undefined,
  listUserByRoleIdApi,
  setRoleUserApi,
);

const [SmartTable, tableApi] = useSmartTable({
  id: 'sys_role_list',
  columns: getTableColumns(),
  border: true,
  stripe: true,
  height: 'auto',
  customConfig: { storage: true },
  pagerConfig: true,
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'roleId',
  },
  sortConfig: {
    remote: true,
    defaultSort: { field: 'seq', order: 'asc' },
  },
  checkboxConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
    commonConfig: {
      labelWidth: 80,
      formItemClass: 'pb-2',
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (model) => getByIdApi(model),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      { code: 'ModalAdd', auth: Permission.add },
      { code: 'delete', auth: Permission.delete },
    ],
  },
  addEditConfig: {
    formConfig: {
      schema: getAddEditFormSchemas(),
    },
  },
});

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      auth: Permission.update,
      onClick: () => tableApi.editByRowModal(row),
    },
    {
      label: t('system.views.role.button.setRoleUser'),
      // preIcon: 'ant-design:user-add-outlined',
      auth: Permission.setRoleUser,
      onClick: () => {
        handleShowSetUser(row);
      },
    },
  ];
};
</script>

<template>
  <div class="smart-table-padding page-container h-full">
    <SmartLayoutSeparate
      layout="leftRight"
      draggable
      second-size="300px"
      class="h-full"
    >
      <template #first>
        <SmartTable class="h-full" @current-change="handleCurrentChange">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getTableActions(row)" />
          </template>
        </SmartTable>
      </template>
      <template #second>
        <div class="layout-set-function h-full">
          <Tabs>
            <TabPane
              :tab="t('system.views.role.title.setFunction')"
              key="functionPermission"
            >
              <RoleSetFunction
                :is-super-admin="currentRow.superAdminYn"
                :role-id="currentRow.roleId"
              />
            </TabPane>
            <TabPane
              :tab="t('system.views.role.title.dataPermission')"
              key="dataPermission"
            >
              <RoleDataPermission
                :is-super-admin="currentRow.superAdminYn"
                :role-id="currentRow.roleId"
              />
            </TabPane>
          </Tabs>
        </div>
      </template>
    </SmartLayoutSeparate>
    <SelectUserModal />
  </div>
</template>

<style scoped>
.layout-set-function {
  background: hsl(var(--background));

  :deep(.ant-layout-sider-children) {
    margin-top: 0;
  }

  :deep(.ant-tabs-nav-wrap) {
    padding-left: 5px;
  }

  :deep(.ant-tabs) {
    height: 100%;
  }

  :deep(.ant-tabs-content) {
    height: 100%;
  }
}
</style>
