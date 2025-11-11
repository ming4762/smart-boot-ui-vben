<script lang="ts" setup>
import type { SmartTableActionItem } from '@vben/common-ui';

import { unref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { warnMessage } from '@smart/common/utils';

import {
  deleteParameterTenantApi,
  getByIdParameterTenantApi,
  listParameterTenantApi,
  saveParameterTenantApi,
  setUseYnParameterTenantApi,
  updateParameterTenantApi,
} from '../SysParameterListView.api';
import {
  getParameterTenantFormSchemas,
  getParameterTenantTableColumns,
  Permissions,
} from '../SysParameterListView.config';

interface Props {
  parameterId?: number;
}
const props = defineProps<Props>();
watch(
  () => props.parameterId,
  () => {
    tableApi.query();
  },
);

const { hasAccessByAuth } = useAccess();

const { getTableSize } = useSizeSetting();

const [SmartTable, tableApi] = useSmartTable({
  columns: getParameterTenantTableColumns(),
  height: 'auto',
  border: true,
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
  pagerConfig: false,
  useSearchForm: false,
  addEditConfig: {
    formConfig: {
      schema: getParameterTenantFormSchemas(),
      wrapperClass: 'grid-cols-1 grid',
      commonConfig: {
        labelWidth: 80,
      },
    },
  },
  proxyConfig: {
    ajax: {
      query: async ({ ajaxParameter }) => {
        if (!props.parameterId) {
          return [];
        }
        return listParameterTenantApi({
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'parameterId@=': props.parameterId,
          },
        });
      },
      save: ({ body: { insertRecords, updateRecords } }) => {
        if (insertRecords.length > 0) {
          return saveParameterTenantApi(insertRecords[0]);
        }
        if (updateRecords.length > 0) {
          return updateParameterTenantApi(updateRecords[0]);
        }
        throw new Error('未知操作');
      },
      delete: ({ body: { removeRecords } }) =>
        deleteParameterTenantApi(removeRecords),
      getById: (params) => getByIdParameterTenantApi(params.id),
      useYn: setUseYnParameterTenantApi,
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
        auth: Permissions.save,
        props: {
          onClick: () => {
            if (!props.parameterId) {
              warnMessage('请先选择系统参数');
              return;
            }
            tableApi.showAddModal(
              {},
              {
                parameterId: props.parameterId,
              },
            );
          },
        },
      },
      {
        code: 'delete',
        auth: Permissions.delete,
      },
    ],
  },
});

const { getIsPlatformTenant, getUserTenant } = useUserStore();

const getActions = (row: Record<string, any>): SmartTableActionItem[] => {
  const hasAuth =
    unref(getIsPlatformTenant) ||
    unref(getUserTenant)?.tenantId === row.tenantId;
  return [
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
      auth: () => hasAuth && hasAccessByAuth(Permissions.update),
    },
    {
      label: t('common.button.delete'),
      onClick: () => tableApi.deleteByRow(row),
      danger: true,
      auth: () => hasAuth && hasAccessByAuth(Permissions.delete),
    },
  ];
};
</script>

<template>
  <div>
    <SmartTable class="smart-table-padding" :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>
