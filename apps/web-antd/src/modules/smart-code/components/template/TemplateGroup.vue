<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { type SmartTableProps, useSmartTable } from '#/adapter/smart-table';
import { SmartIconButton, useContextMenu } from '#/components';
import {
  deleteGroupByIdApi,
  getGroupByIdApi,
  listGroupApi,
  saveUpdateGroupApi,
} from '#/modules/smart-code/views/template/CodeTemplateList.api';

interface Props {
  tableProps?: SmartTableProps;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  tableProps: undefined,
});

const emit = defineEmits(['change']);

const { getTableSize } = useSizeSetting();

const { createContextMenu } = useContextMenu();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-tool-code-templateGroup',
  stripe: true,
  height: 'auto',
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'groupId',
  },
  columns: [
    {
      title: '{smart.code.views.template.title.templateGroup}',
      field: 'groupName',
      slots: {
        default: 'table-groupName',
      },
    },
  ],
  addEditConfig: {
    formConfig: {
      schema: [
        {
          fieldName: 'groupId',
          label: '',
          component: 'Input',
          dependencies: {
            triggerFields: ['groupId'],
            show: false,
          },
        },
        {
          fieldName: 'groupName',
          label: t('smart.code.views.template.title.templateGroup'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'seq',
          label: t('smart.code.views.template.title.seq'),
          component: 'InputNumber',
          rules: 'required',
        },
      ],
    },
  },
});

const getTableProps = computed<SmartTableProps>(() => {
  return {
    columns: [
      {
        title: '{smart.code.views.template.title.templateGroup}',
        field: 'groupName',
      },
    ],
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: (params) => {
          return listGroupApi({
            ...params.ajaxParameter,
            sortName: 'seq',
          });
        },
        save: ({ body: { insertRecords, updateRecords } }) =>
          saveUpdateGroupApi([...insertRecords, ...updateRecords][0]),
        getById: (row) => getGroupByIdApi(row.groupId),
        delete: ({ body: { removeRecords } }) =>
          deleteGroupByIdApi(removeRecords.map((item) => item.groupId)),
      },
    },
    ...props.tableProps,
  };
});

const handleContext = (e: MouseEvent, row: any) => {
  return createContextMenu({
    event: e,
    items: [
      {
        label: t('common.button.edit'),
        icon: 'ant-design:edit-outlined',
        handler: () => tableApi.editByRowModal(row),
      },
      {
        label: t('common.button.delete'),
        icon: 'ant-design:delete-outlined',
        handler: () => tableApi.deleteByRow(row),
      },
    ],
  });
};

const currentGroupIdRef = ref<null | number>(null);
const handleCellClick = ({ row }: any) => {
  currentGroupIdRef.value =
    unref(currentGroupIdRef) === row.groupId ? null : row.groupId;
};
watch(currentGroupIdRef, (value) => {
  const tableInstance = tableApi.getGrid();
  if (value === null) {
    tableInstance.clearCurrentRow();
  } else {
    tableInstance.setCurrentRow({ groupId: value });
  }
  emit('change', value);
});
</script>

<template>
  <div class="smart-code-component-template-group h-full">
    <SmartTable
      v-bind="getTableProps"
      :size="getTableSize as never"
      class="table-container"
      @cell-click="handleCellClick"
    >
      <template #table-groupName="{ row }">
        <div
          v-if="editable"
          style="cursor: pointer"
          @contextmenu="(e) => handleContext(e, row)"
        >
          {{ row.groupName }}
        </div>
        <span v-else>{{ row.groupName }}</span>
      </template>
    </SmartTable>
    <div v-if="editable" class="button-container">
      <SmartIconButton
        block
        class="button"
        type="primary"
        @click="() => tableApi.showAddModal()"
      >
        {{ t('common.button.add') }}
      </SmartIconButton>
    </div>
  </div>
</template>

<style scoped lang="less">
@buttonContainerHeight: 50px;
.smart-code-component-template-group {
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

  :deep(.smart-table-container) {
    padding: 0;
  }
}
</style>
