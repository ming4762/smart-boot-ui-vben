<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { SysTenantProps } from '../SysTenantManagerPlatformView.confg';

import { ref, toRefs } from 'vue';

import {
  SmartLayoutSeparate,
  SmartVxeTableAction,
  useSmartTable,
} from '@vben/common-ui';
import { useSizeSetting, useTabLazy } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { TabPane, Tabs } from 'antdv-next';

import RoleDataPermission from '#/views/role/components/RoleDataPermission.vue';
import { useRoleSetUser } from '#/views/role/hook/useRoleSetUser';

import {
  getRoleByIdApi,
  listRoleByTenantIdApi,
  listUserByRoleTenantApi,
  listUserByTenantApi,
  setRoleUserWithTenantApi,
} from '../SysTenantManagerPlatformView.api';
import {
  getRoleAddEditFormSchemas,
  getRoleTableColumns,
} from '../SysTenantManagerPlatformView.confg';
import TenantRoleSetFunction from './TenantRoleSetFunction.vue';

interface Props extends SysTenantProps {}

const props = defineProps<Props>();

const { tenantId: tenantIdRef, activated } = toRefs(props);

const { getTableSize } = useSizeSetting();

/**
 * 监控当前tab是否激活
 * 激活时，自动查询数据
 */
useTabLazy(tenantIdRef, activated, () => tableApi.query());

const currentRoleRef = ref<Recordable<any>>({});
const handleCurrentChange = ({ row }: any) => {
  currentRoleRef.value = row;
};

const { handleShowSetUser, SelectUserModal } = useRoleSetUser(
  (parameter: any) =>
    listUserByTenantApi({
      ...parameter,
      tenantId: props.tenantId,
    }),
  (roleIds: number[]) =>
    listUserByRoleTenantApi({ roleIdList: roleIds, tenantId: props.tenantId }),
  (roleId: number, userIdList: number[]) =>
    setRoleUserWithTenantApi(props.tenantId!, roleId, userIdList),
);

const [SmartTable, tableApi] = useSmartTable({
  id: 'system-tenant-roleList',
  columns: getRoleTableColumns(),
  height: 'auto',
  useSearchForm: false,
  customConfig: { storage: true },
  stripe: true,
  border: true,
  checkboxConfig: true,
  showOverflow: 'tooltip',
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
  pagerConfig: true,
  addEditConfig: {
    formConfig: {
      schema: getRoleAddEditFormSchemas(),
    },
  },
  proxyConfig: {
    ajax: {
      query: async ({ ajaxParameter }) => {
        if (!props.tenantId) {
          return {
            rows: [],
            total: 0,
          };
        }
        return listRoleByTenantIdApi({
          ...ajaxParameter,
          tenantId: props.tenantId,
        });
      },
      getById: (model) => getRoleByIdApi(model.roleId),
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [{ code: 'ModalAdd' }, { code: 'delete' }],
  },
});

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      code: 'edit',
      onClick: () => tableApi.editByRowModal(row),
    },
    {
      label: t('system.views.role.button.setRoleUser'),
      // preIcon: 'ant-design:user-add-outlined',
      onClick: () => {
        handleShowSetUser(row);
      },
    },
  ];
};
</script>

<template>
  <div class="h-full">
    <SmartLayoutSeparate
      layout="leftRight"
      draggable
      second-size="300px"
      class="h-full"
    >
      <template #first>
        <SmartTable
          :size="getTableSize as never"
          class="h-full"
          @current-change="handleCurrentChange"
        >
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
              <TenantRoleSetFunction
                :is-super-admin="currentRoleRef.superAdminYn"
                :role-id="currentRoleRef.roleId"
                :tenant-id="props.tenantId"
                :activated="activated"
              />
            </TabPane>
            <TabPane
              :tab="t('system.views.role.title.dataPermission')"
              key="dataPermission"
            >
              <RoleDataPermission
                :is-super-admin="currentRoleRef.superAdminYn"
                :role-id="currentRoleRef.roleId"
              />
            </TabPane>
          </Tabs>
        </div>
      </template>
    </SmartLayoutSeparate>
    <SelectUserModal />
  </div>
</template>

<style lang="less" scoped>
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
