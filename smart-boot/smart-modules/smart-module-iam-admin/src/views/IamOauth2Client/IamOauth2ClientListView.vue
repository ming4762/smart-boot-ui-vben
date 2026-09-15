<script lang="ts" setup>
import type { SmartTableActionItem } from '@vben/common-ui';

import {
  SmartVxeTableAction,
  useSmartTable,
  useVbenModal,
} from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { CheckableTagGroup } from 'antdv-next';

import IamOauth2ClientInitializeModal from './IamOauth2ClientInitializeModal.vue';
import {
  batchSaveUpdateApi,
  deleteApi,
  getByIdApi,
  listApi,
  setUseYnApi,
} from './IamOauth2ClientListView.api';
import {
  authorizationGrantTypes,
  clientAuthenticationMethods,
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permissions,
} from './IamOauth2ClientListView.config';

const { getTableSize } = useSizeSetting();

const [InitializeClientModal, initializeClientModalApi] = useVbenModal({
  connectedComponent: IamOauth2ClientInitializeModal,
});

const [SmartTable, tableApi] = useSmartTable({
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
    defaultSort: { field: 'seq', order: 'asc' },
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
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'gap-1',
    compact: true,
    layout: 'inline',
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
    modalConfig: {
      class: 'w-[800px]',
    },
    formConfig: {
      schema: getFormSchemas(),
      wrapperClass: 'grid-cols-2 grid',
      commonConfig: {
        labelWidth: 140,
      },
    },
  },
  proxyConfig: {
    ajax: {
      query: (params) => listApi(params.ajaxParameter),
      save: ({ body: { insertRecords, updateRecords } }) =>
        batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
      useYn: setUseYnApi,
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
      },
      {
        code: 'delete',
        auth: Permissions.delete,
      },
      {
        code: 'useYnTrue',
        auth: Permissions.setUseYn,
      },
      {
        code: 'useYnFalse',
        auth: Permissions.setUseYn,
      },
    ],
  },
});

/**
 * 复制指定客户端并以新增模式打开表单。
 *
 * @param row 待复制的客户端列表记录
 * @returns 弹窗打开结果
 */
const copyClient = async (row: Record<string, any>) => {
  const client = await getByIdApi(row.id);
  return tableApi.showAddModal(undefined, {
    ...client,
    id: undefined,
    clientCode: '',
    clientName: '',
  });
};

const getActions = (row: Record<string, any>): SmartTableActionItem[] => {
  return [
    {
      label: '初始化客户端',
      auth: Permissions.update,
      onClick: () => initializeClientModalApi.setData(row).open(),
    },
    {
      label: '复制',
      auth: Permissions.save,
      onClick: () => copyClient(row),
    },
    {
      label: t('common.button.edit'),
      onClick: () => tableApi.editByRowModal(row),
      auth: Permissions.update,
    },
    {
      label: t('common.button.delete'),
      onClick: () => tableApi.deleteByRow(row),
      danger: true,
      auth: Permissions.delete,
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <InitializeClientModal />
    <SmartTable class="smart-table-padding" :size="getTableSize as never">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
      <template #form-clientAuthenticationMethods="{ componentField, values }">
        <CheckableTagGroup
          multiple
          v-bind="componentField"
          :value="values.clientAuthenticationMethods"
          :options="clientAuthenticationMethods"
        />
      </template>
      <template #form-authorizationGrantTypes="{ componentField, values }">
        <CheckableTagGroup
          multiple
          v-bind="componentField"
          :value="values.authorizationGrantTypes"
          :options="authorizationGrantTypes"
        />
      </template>
    </SmartTable>
  </div>
</template>
