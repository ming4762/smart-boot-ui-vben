<script setup lang="tsx">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { RoleManagementAdapter } from '../../permission-management/types';

import { ref } from 'vue';

import {
  ResizableLayout,
  SmartVxeTableAction,
  useSmartTable,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { Tabs } from 'antdv-next';

import FunctionGrantPanel from '../../permission-management/FunctionGrantPanel.vue';
import RoleDataPermission from './components/RoleDataPermission.vue';
import { useRoleSetUser } from './hook/useRoleSetUser';
import {
  getAddEditFormSchemas,
  getSearchSchemas,
  getTableColumns,
} from './RoleListView.config';

/** 可复用管理面板；父级切换范围时通过 key 销毁旧实例。 */
const props = defineProps<{ adapter: RoleManagementAdapter }>();
const adapter = props.adapter;
const Permission = adapter.permissions;

const currentRow = ref<Recordable<any>>({});
const handleCurrentChange = ({ row }: any) => {
  currentRow.value = row;
};

const { handleShowSetUser, SelectUserModal } = useRoleSetUser(
  adapter.listUsers,
  adapter.listRoleUsers,
  adapter.saveRoleUsers,
);

const [SmartTable, tableApi] = useSmartTable({
  id: adapter.scopeKey,
  columns: getTableColumns(),
  border: true,
  stripe: true,
  height: 'auto',
  customConfig: { storage: true },
  pagerConfig: adapter.paged,
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
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    commonConfig: {
      labelWidth: 80,
      formItemClass: 'pb-2',
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => {
        currentRow.value = {};
        return adapter.list(params.ajaxParameter ?? {});
      },
      delete: ({ body: { removeRecords } }) => adapter.remove(removeRecords),
      getById: (model) => adapter.get(model),
      save: ({ body: { insertRecords, updateRecords } }) =>
        adapter.save([...insertRecords, ...updateRecords]),
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

const tabItems = [
  {
    key: 'functionPermission',
    label: t('system.views.role.title.setFunction'),
  },
  {
    key: 'dataPermission',
    label: t('system.views.role.title.dataPermission'),
  },
].filter((item) => adapter.dataPermission || item.key !== 'dataPermission');
</script>

<template>
  <div class="smart-table-padding h-full">
    <ResizableLayout
      class="h-full"
      divider-size="5px"
      resize-mode="preview"
      resizable
      :second-size="300"
      size-unit="px"
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
          <Tabs :items="tabItems">
            <template #contentRender="{ item }">
              <FunctionGrantPanel
                :adapter="adapter.grant"
                v-if="item.key === 'functionPermission'"
                :is-super-admin="currentRow.superAdminYn"
                :resource-id="currentRow.roleId"
              />
              <RoleDataPermission
                v-if="item.key === 'dataPermission'"
                :is-super-admin="currentRow.superAdminYn"
                :role-id="currentRow.roleId"
              />
            </template>
          </Tabs>
        </div>
      </template>
    </ResizableLayout>
    <SelectUserModal />
  </div>
</template>

<style scoped lang="less">
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

  :deep(.ant-tabs-body) {
    height: 100%;
  }

  :deep(.ant-tabs-content) {
    height: 100%;
  }

  :deep(.ant-tabs-tabpane) {
    height: 100%;
  }
}
</style>
