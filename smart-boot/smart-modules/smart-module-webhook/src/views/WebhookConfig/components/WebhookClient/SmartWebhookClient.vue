<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import type { WebhookClient } from '../../../../types/webhook';

import { watch } from 'vue';

import { SmartVxeTableAction, useSmartTable } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';

import {
  deleteClientApi,
  getClientByIdApi,
  listClientApi,
  saveClientApi,
  setClientUseYnApi,
  updateClientApi,
} from '../../SmartWebhookConfigView.api';
import {
  getClientFormSchemas,
  getClientSearchSchemas,
  getClientTableColumns,
  WebhookClientPermission,
} from '../../SmartWebhookConfigView.config';

const props = defineProps<{ selectedClient?: WebhookClient }>();
const emit = defineEmits<{
  select: [client: undefined | WebhookClient];
}>();

const { getTableSize } = useSizeSetting();

const setCurrentRow = () => {
  const grid = tableApi.getGrid();
  grid?.clearCurrentRow();
  if (props.selectedClient) {
    grid?.setCurrentRow({ id: props.selectedClient.id });
  }
};

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-webhook-client',
  columns: getClientTableColumns(),
  height: 'auto',
  border: true,
  stripe: true,
  showOverflow: 'tooltip',
  customConfig: { storage: true },
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'id',
  },
  checkboxConfig: true,
  pagerConfig: true,
  sortConfig: {
    remote: true,
    defaultSort: { field: 'createTime', order: 'desc' },
  },
  columnConfig: { resizable: true },
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    searchWithSymbol: true,
    schema: getClientSearchSchemas(),
    commonConfig: {
      labelWidth: 90,
      formItemClass: 'pb-2',
      componentProps: { style: { maxWidth: '160px' } },
    },
  },
  addEditConfig: {
    modalConfig: { class: 'w-[640px]' },
    formConfig: { schema: getClientFormSchemas() },
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => listClientApi(ajaxParameter ?? {}),
      getById: ({ id }) => getClientByIdApi(id),
      save: ({ body: { insertRecords, updateRecords } }) => {
        if (insertRecords.length > 0) {
          return saveClientApi(insertRecords[0]);
        }
        return updateClientApi(updateRecords[0]);
      },
      delete: ({ body: { removeRecords } }) =>
        deleteClientApi(removeRecords as WebhookClient[]),
      useYn: setClientUseYnApi,
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    sizeSetting: true,
    custom: true,
    buttons: [
      { code: 'ModalAdd', auth: WebhookClientPermission.save },
      { code: 'delete', auth: WebhookClientPermission.delete },
      { code: 'useYnTrue', auth: WebhookClientPermission.setUseYn },
      { code: 'useYnFalse', auth: WebhookClientPermission.setUseYn },
    ],
  },
});

watch(() => props.selectedClient?.id, setCurrentRow);

const getActions = (row: WebhookClient): SmartTableActionItem[] => [
  {
    code: 'edit',
    auth: WebhookClientPermission.update,
    onClick: () => tableApi.editByRowModal(row),
  },
  {
    code: 'delete',
    auth: WebhookClientPermission.delete,
    danger: true,
    onClick: async () => {
      await tableApi.deleteByRow(row);
      if (props.selectedClient?.id === row.id) emit('select', undefined);
    },
  },
];

const handleCurrentChange = ({ row }: { row: WebhookClient }) => {
  emit('select', row);
};
</script>

<template>
  <section
    class="flex h-full min-h-0 flex-col"
    aria-labelledby="webhook-client-title"
  >
    <div class="min-h-0 flex-1">
      <SmartTable
        :size="getTableSize as never"
        @current-change="handleCurrentChange"
        @proxy-query="setCurrentRow"
      >
        <template #table-operation="{ row }">
          <SmartVxeTableAction :actions="getActions(row)" />
        </template>
      </SmartTable>
    </div>
  </section>
</template>
