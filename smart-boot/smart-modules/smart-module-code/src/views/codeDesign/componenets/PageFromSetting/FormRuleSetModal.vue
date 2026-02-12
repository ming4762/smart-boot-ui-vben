<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';

import { ref, unref } from 'vue';

import { useSmartTable, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { isString } from '@vben/utils';

import { errorMessage } from '@smart/common/utils';
import { SmartIconButton } from '@smart/components';
import { FormItem, Switch } from 'antdv-next';

import { getRuleList } from '../PageSettingSupport';

const { getTableSize } = useSizeSetting();

// 是否自动配置
const autoValidateRef = ref(false);
const currentDataRef = ref<any>({});
const ruleListRef = ref<any[]>([]);

const [SmartTable, tableApi] = useSmartTable({
  useSearchForm: false,
  height: 'auto',
  editConfig: {
    trigger: 'click',
    mode: 'row',
  },
  border: true,
  editRules: {
    message: [{ required: true, content: '请填写校验文案' }],
    ruleTrigger: [{ required: true, content: '请选择触发时机' }],
    ruleType: [{ required: true, content: '校验类型必须选择' }],
  },
  toolbarConfig: {
    slots: {
      tools: 'table-tools',
      buttons: 'table-buttons',
    },
  },
  columns: [
    {
      title: '校验类型',
      field: 'ruleType',
      width: 140,
      editRender: {
        name: 'ASelect',
        options: getRuleList(),
        props: {
          class: 'w-full',
        },
      },
    },
    {
      title: '触发时机',
      field: 'ruleTrigger',
      width: 150,
      editRender: {
        name: 'ASelect',
        options: [
          {
            value: 'BLUR',
            label: 'blur',
          },
          {
            value: 'CHANGE',
            label: 'change',
          },
        ],
        props: {
          class: 'w-full',
          multiple: true,
        },
      },
    },
    {
      title: '长度',
      field: 'len',
      width: 120,
      editRender: {
        name: 'AInput',
        props: { type: 'number' },
      },
    },
    {
      title: '最大长度',
      field: 'max',
      width: 120,
      editRender: {
        name: 'AInput',
        props: { type: 'number' },
      },
    },
    {
      title: '最小长度',
      field: 'min',
      width: 120,
      editRender: {
        name: 'AInput',
        props: { type: 'number' },
      },
    },
    {
      title: '校验文案',
      field: 'message',
      minWidth: 200,
      editRender: {
        name: 'AInput',
      },
    },
    {
      title: '正则表达式',
      field: 'pattern',
      width: 180,
      editRender: {
        name: 'AInput',
      },
    },
    {
      title: '操作',
      field: 'options',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-options',
      },
    },
  ],
});

/**
 * 校验数据
 */
const validateData = (dataList: Array<any>) => {
  // 验证类型是否重复
  const hasType: Array<string> = [];
  for (const { ruleType, pattern } of dataList) {
    if (hasType.includes(ruleType)) {
      return `校验类型不可重复：${ruleType}`;
    }
    hasType.push(ruleType);
    if (ruleType === 'regexp' && (pattern === null || pattern.trim() === '')) {
      return '正则类型必须设置正则表达式';
    }
  }
  return null;
};

const handleOk = async (modalApi: ExtendedModalApi) => {
  const vxeTable = tableApi.getGrid();
  const errMap = await vxeTable.fullValidate().catch((error) => error);
  if (errMap) {
    errorMessage('校验不通过!');
    return false;
  }
  const autoValidate = unref(autoValidateRef);
  if (autoValidate) {
    unref(currentDataRef).autoValidate = true;
    unref(currentDataRef).ruleList = [];
    modalApi.close();
    return;
  }
  const { tableData } = vxeTable.getTableData();
  const validateMessage = validateData(tableData);
  if (validateMessage) {
    errorMessage(validateMessage);
    return false;
  }
  const ruleList = tableData.map((item) => {
    const { ruleTrigger } = item;
    const result: any = { ...item };
    if (ruleTrigger && isString(ruleTrigger)) {
      result.ruleTrigger = [ruleTrigger];
    }
    return result;
  });
  unref(currentDataRef).autoValidate = false;
  unref(currentDataRef).ruleList = ruleList;
  modalApi.close();
};

const [Modal, modalApi] = useVbenModal({
  class: 'w-[1000px] form-rule-set-modal h-[600px]',
  title: '配置验证规则',
  onOpened: () => {
    const data = modalApi.getData();
    currentDataRef.value = data;
    autoValidateRef.value = data.autoValidate;
    ruleListRef.value = data.ruleList || [];
  },
  onConfirm: () => handleOk(modalApi),
});

const handleDeleteRow = (row: any) => {
  tableApi.getGrid().remove(row);
};

const insertRow = async () => {
  const vxeGrid = tableApi.getGrid();
  const { row: newRow } = await vxeGrid.insertAt({}, -1);
  await vxeGrid.setEditCell(newRow, 'ruleType');
};
</script>

<template>
  <Modal v-bind="$attrs">
    <SmartTable
      :data="ruleListRef"
      :size="getTableSize as never"
      class="form-rule-set-table"
    >
      <template #table-options="{ row }">
        <SmartIconButton size="small" @click="() => handleDeleteRow(row)">
          删除
        </SmartIconButton>
      </template>
      <template #table-tools>
        <SmartIconButton
          :disabled="autoValidateRef"
          size="small"
          type="primary"
          @click="insertRow"
        >
          添加一行
        </SmartIconButton>
      </template>
      <template #table-buttons>
        <FormItem label="是否自动校验">
          <Switch v-model:checked="autoValidateRef" />
        </FormItem>
        <span style="margin-left: 10px">
          开启后，校验参数自动生成，配置的校验内容无效
        </span>
      </template>
    </SmartTable>
  </Modal>
</template>

<style scoped>
.form-rule-set-table {
  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}
</style>
