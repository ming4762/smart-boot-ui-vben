<script setup lang="ts">
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { Input } from 'ant-design-vue';

import { type SmartTableColumn, useSmartTable } from '#/adapter/smart-table';
import { ApiServiceEnum, requestClient } from '#/api/request';

interface Props {
  multiple?: boolean;
  selectTableList?: any[];
  size?: string;
  formSize?: string;
}
const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  selectTableList: () => [],
  size: undefined,
  formSize: undefined,
});
const emit = defineEmits<{ ok: [any[]] }>();

const columns = [
  {
    title: '{smart.code.views.codeManager.table.connectionName}',
    field: 'connectionName',
    width: 120,
  },
  {
    title: '{smart.code.views.codeManager.table.configName}',
    field: 'configName',
    width: 120,
  },
  {
    title: '{smart.code.views.codeManager.table.tableName}',
    field: 'tableName',
    width: 160,
  },
  {
    title: '{smart.code.views.addendumTable.title.relatedColumn}',
    field: 'relatedColumn',
    width: 120,
    editRender: {
      name: 'AInput',
    },
  },
  {
    title: '{smart.code.views.codeManager.table.remarks}',
    field: 'remarks',
    minWidth: 120,
  },
  {
    title: '{common.table.remark}',
    field: 'remark',
    minWidth: 200,
  },
];

const computedColumns = computed<Partial<SmartTableColumn>[]>(() => {
  const firstColumn: SmartTableColumn = {
    type: 'checkbox',
    width: 60,
  };
  if (!props.multiple) {
    firstColumn.type = 'radio';
  }
  return [firstColumn, ...columns] as Partial<SmartTableColumn>[];
});

const [SmartTable, tableApi] = useSmartTable({
  pagerConfig: false,
  height: 'auto',
  size: 'small',
  checkboxConfig: true,
  useSearchForm: true,
  editConfig: {
    trigger: 'click',
    mode: 'row',
  },
  editRules: {
    relatedColumn: [
      {
        required: true,
        validator: ({ cellValue, row }) => {
          if (!cellValue || cellValue.trim().length === 0) {
            return new Error(
              t(
                'smart.code.views.addendumTable.validate.relatedColumnWithConfig',
                {
                  relatedColumn: row.configName,
                },
              ),
            );
          }
        },
      },
    ],
  },
  searchFormConfig: {
    actionWrapperClass: 'pb-2 ml-1.5',
    wrapperClass: 'flex flex-wrap',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
    schema: [
      {
        label: t('smart.code.views.codeManager.table.configName'),
        fieldName: 'configName',
        component: 'Input',
      },
      {
        label: t('smart.code.views.codeManager.table.tableName'),
        fieldName: 'tableName',
        component: 'Input',
      },
    ],
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async (params) => {
        const result = await requestClient.post<any[]>(
          'db/code/main/list',
          {
            ...params.ajaxParameter,
            parameter: {
              'type@=': '30',
            },
          },
          { service: ApiServiceEnum.SMART_CODE },
        );
        const selectTableList = props.selectTableList;
        if (selectTableList.length > 0) {
          const selectTableMap: Map<number, any> = new Map<number, any>();
          selectTableList.forEach((item) => {
            selectTableMap.set(item.addendumId, item);
          });
          // 选中的行
          const selectRowsList: Array<any> = [];
          result.forEach((item) => {
            if (selectTableMap.has(item.id)) {
              selectRowsList.push(item);
              item.relatedColumn = selectTableMap.get(item.id).relatedColumn;
            }
          });
          if (selectRowsList.length > 0) {
            const grid = tableApi.getGrid();
            if (props.multiple) {
              grid.setCheckboxRow(selectRowsList, true);
            } else {
              grid.setRadioRow(selectRowsList[0]);
            }
          }
        }
        return result;
      },
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[920px] h-[500px]',
  title: t('smart.code.views.codeCreateForm.title.choseAddendum'),
  onOpened: () => {
    tableApi.query();
  },
  onConfirm: async () => {
    const data: any[] = [];
    const grid = tableApi.getGrid();
    if (props.multiple) {
      data.push(...grid.getCheckboxRecords(false));
    } else {
      const row = grid.getRadioRecord(false);
      if (row) {
        data.push(row);
      }
    }
    const validateResult = await grid.validate(data);
    if (validateResult) {
      return false;
    }
    const dealData = data.map((item) => {
      return {
        addendumId: item.id,
        relatedColumn: item.relatedColumn,
        configName: item.configName,
      };
    });
    emit('ok', dealData);
    // 关闭弹窗
    modalApi.close();
  },
});
</script>

<template>
  <Modal v-bind="$attrs">
    <SmartTable :columns="computedColumns" :size="props.size as never">
      <template #table-relatedColumn="{ row }">
        <Input v-model:value="row.relatedColumn" :size="formSize as never" />
      </template>
    </SmartTable>
  </Modal>
</template>

<style scoped></style>
