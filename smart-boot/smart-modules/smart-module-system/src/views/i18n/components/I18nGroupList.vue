<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { nextTick, ref, unref, watch } from 'vue';

import { useSmartTable } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { SmartAuthButton, useContextMenu } from '@smart/components';

import {
  deleteGroupApi,
  getGroupByIdApi,
  listGroupTreeApi,
  saveUpdateGroupApi,
} from './i18n.api';
import { Permission } from './i18n.config';

const emit = defineEmits(['change']);

const currentRowRef = ref<any | null>(null);
watch(currentRowRef, () => emit('change', unref(currentRowRef)?.id));

const [SmartTable, tableApi] = useSmartTable({
  rowConfig: { keyField: 'id', isCurrent: true },
  height: 'auto',
  treeConfig: {
    reserve: true,
    expandAll: true,
  },
  cellClassName: 'cursor-pointer',
  columns: [
    {
      title: '{system.views.i18n.group.groupName}',
      field: 'text',
      treeNode: true,
      slots: {
        default: 'table-groupName',
      },
    },
  ],
  proxyConfig: {
    ajax: {
      query: listGroupTreeApi,
      getById: (row) => getGroupByIdApi(row.groupId),
      save: ({ body: { insertRecords, updateRecords } }) =>
        saveUpdateGroupApi([...insertRecords, ...updateRecords][0]),
      delete: ({ body: { removeRecords } }) => {
        return deleteGroupApi(removeRecords.map((item) => item.groupId));
      },
    },
  },
  addEditConfig: {
    formConfig: {
      schema: [
        {
          label: '',
          component: 'Input',
          fieldName: 'parentId',
          dependencies: {
            show: false,
            triggerFields: ['parentId'],
          },
        },
        {
          label: '上级',
          component: 'Input',
          fieldName: 'parentName',
          dependencies: {
            disabled: true,
            triggerFields: ['parentName'],
          },
        },
        {
          label: '',
          component: 'Input',
          fieldName: 'groupId',
          dependencies: {
            show: false,
            triggerFields: ['groupId'],
          },
        },
        {
          label: t('system.views.i18n.group.groupName'),
          component: 'Input',
          fieldName: 'groupName',
          rules: 'required',
        },
        {
          label: t('system.views.i18n.group.seq'),
          component: 'InputNumber',
          fieldName: 'seq',
          defaultValue: 1,
          rules: 'required',
        },
      ],
    },
  },
});

const { createContextMenu } = useContextMenu();
const handleContext = (e: MouseEvent, row: Recordable<any>) => {
  createContextMenu({
    event: e,
    items: [
      {
        label: t('common.button.edit'),
        icon: 'ant-design:edit-outlined',
        handler: () => {
          tableApi.editByRowModal(row.data);
        },
      },
      {
        label: t('common.button.delete'),
        icon: 'ant-design:delete-outlined',
        handler: () => {
          tableApi.deleteByRow(row.data);
        },
      },
    ],
  });
};

const handleCellClick = ({ row }: any) => {
  currentRowRef.value = unref(currentRowRef)?.id === row.id ? null : row;
  nextTick(() => {
    const tableInstance = tableApi.getGrid();
    if (unref(currentRowRef) === null) {
      tableInstance.clearCurrentRow();
    } else {
      tableInstance.setCurrentRow(row);
    }
  });
};

/**
 * 添加事件
 */
const handleAdd = () => {
  const currentRow = unref(currentRowRef);
  const parentData =
    currentRow === null
      ? { parentId: 0, parentName: 'Root' }
      : { parentId: currentRow.id, parentName: currentRow.text };
  tableApi.showAddModal({}, parentData);
};
</script>

<template>
  <div class="smart-system-i18nGroup bg-background h-full">
    <div class="table-container">
      <SmartTable v-bind="$attrs" @cell-click="handleCellClick">
        <template #table-groupName="{ row }">
          <div @contextmenu="(e) => handleContext(e, row)">{{ row.text }}</div>
        </template>
      </SmartTable>
    </div>
    <div class="button-container">
      <SmartAuthButton
        :auth="Permission.add"
        block
        class="button"
        type="primary"
        @click="handleAdd"
      >
        {{ t('common.button.add') }}
      </SmartAuthButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
@buttonContainerHeight: 60px;
.smart-system-i18nGroup {
  :deep(.smart-table-container) {
    padding: 0;
  }
  .smart-table-container {
    padding: 0;
  }

  .table-container {
    height: calc(100% - @buttonContainerHeight);
  }

  .button-container {
    height: @buttonContainerHeight;
    line-height: @buttonContainerHeight;
    text-align: center;

    .button {
      width: 90%;
    }
  }
}
</style>
