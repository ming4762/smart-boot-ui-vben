<script setup lang="ts">
import { ref, toRaw, unref, watchEffect } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';
import { $t as t } from '@vben/locales';

import { Switch } from 'ant-design-vue';

import {
  getTableBooleanColumnClass,
  useSmartTable,
} from '#/adapter/smart-table';
import { SmartIconButton } from '#/components';
import { createConfirm } from '#/utils';

import { getControlList } from '../../constants';
import {
  injectCodeDesignContext,
  injectCodeDesignHandler,
} from '../../useContext';
import { vueTableHeaderCheckboxSupport } from '../PageSettingSupport';
import FormRuleSetModal from './FormRuleSetModal.vue';

const { getFormSize, getButtonSize } = useSizeSetting();

const { contextData } = injectCodeDesignContext();
const { registerSaveDataHandler } = injectCodeDesignHandler();

const [RenderFormRuleSetModal, modalApi] = useVbenModal({
  connectedComponent: FormRuleSetModal,
});

const openRuleSetModal = (row: any) => {
  modalApi.setData(row);
  modalApi.open();
};

const [SmartTable] = useSmartTable({
  useSearchForm: false,
  rowConfig: {
    useKey: true,
    isHover: true,
    drag: true,
  },
  align: 'center',
  stripe: true,
  border: true,
  editConfig: {
    trigger: 'click',
    mode: 'row',
  },
  columns: [
    {
      title: '#',
      field: 'drag',
      dragSort: true,
      width: 60,
      align: 'center',
    },
    {
      title: '{smart.code.views.tableField.title.columnName}',
      field: 'columnName',
      width: 160,
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '{smart.code.views.tableSetting.title.title}',
      field: 'title',
      width: 160,
      align: 'left',
      headerAlign: 'center',
      editRender: {
        name: 'AInput',
      },
    },
    {
      title: '{smart.code.views.formSetting.title.controlType}',
      field: 'controlType',
      width: 150,
      editRender: {
        name: 'ASelect',
        props: {
          class: 'w-[100px]',
          options: getControlList(),
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.readonly}',
      ...getTableBooleanColumnClass('readonly', false),
      field: 'readonly',
      width: 130,
      slots: {
        header: 'table-readonly-header',
      },
      editRender: {
        name: 'ASwitch',
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.visible}',
      ...getTableBooleanColumnClass('visible', false),
      field: 'visible',
      width: 130,
      slots: {
        header: 'table-visible-header',
      },
      editRender: {
        name: 'ASwitch',
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.hidden}',
      ...getTableBooleanColumnClass('hidden', false),
      field: 'hidden',
      width: 130,
      slots: {
        header: 'table-hidden-header',
      },
      editRender: {
        name: 'ASwitch',
      },
    },
    {
      title: '{smart.code.views.formSetting.title.used}',
      ...getTableBooleanColumnClass('used', false),
      field: 'used',
      width: 150,
      slots: {
        header: 'table-used-header',
      },
      editRender: {
        name: 'ASwitch',
      },
    },
    {
      title: '{smart.code.views.formSetting.title.useTableSearch}',
      ...getTableBooleanColumnClass('useTableSearch', false),
      field: 'useTableSearch',
      width: 110,
      editRender: {
        name: 'ASwitch',
      },
    },
    {
      title: '{smart.code.views.design.formSetting.title.tableName}',
      field: 'tableName',
      width: 120,
      editRender: {
        name: 'AInput',
        props: ({ row }) => {
          return {
            disabled: !row.useTableSearch,
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.keyColumnName}',
      field: 'keyColumnName',
      width: 120,
      editRender: {
        name: 'AInput',
        props: ({ row }) => {
          return {
            disabled: !row.useTableSearch,
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.valueColumnName}',
      field: 'valueColumnName',
      width: 120,
      editRender: {
        name: 'AInput',
        props: ({ row }) => {
          return {
            disabled: !row.useTableSearch,
          };
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.tableWhere}',
      field: 'tableWhere',
      minWidth: 180,
      editRender: {
        name: 'AInput',
      },
    },
    {
      title: '{smart.code.views.formSetting.title.rules}',
      field: 'rules',
      width: 180,
      slots: {
        default: 'table-rules',
      },
    },
    {
      title: '{smart.code.views.codeManager.table.remarks}',
      field: 'remarks',
      width: 160,
      align: 'left',
      headerAlign: 'center',
    },
  ],
});

const copyField = [
  'columnName',
  'remarks',
  'nullable',
  'javaProperty',
  'extType',
  'javaType',
  'simpleJavaType',
];
/**
 * 创建数据
 */
const createDataFromTableData = (
  tableData: Array<any>,
  editData: Array<any> | undefined,
) => {
  if (editData) {
    return editData;
  }
  return tableData.map((item) => {
    const data: any = {};
    copyField.forEach((field) => {
      data[field] = item[field];
    });
    return Object.assign(data, {
      title: data.remarks || data.javaProperty,
      readonly: false,
      visible: true,
      hidden: false,
      used: true,
      controlType: 'INPUT',
      rules: [],
      useTableSearch: false,
    });
  });
};

const data = ref<Array<any>>([]);
watchEffect(() => {
  data.value = createDataFromTableData(
    unref(contextData).tableData,
    unref(contextData).editConfigData?.codeFormConfigList,
  );
});

registerSaveDataHandler(() => {
  const dataList = toRaw(unref(data));
  const nonNullField: Array<string> = [];
  dataList.forEach((item) => {
    if (
      item.nullable === 0 &&
      (item.visible === false || item.used === false)
    ) {
      nonNullField.push(item.columnName);
    }
  });
  return nonNullField.length > 0
    ? new Promise((resolve) => {
        const modal = createConfirm({
          content: t(
            'smart.code.views.codeManager.message.saveConfirmContent',
            {
              nonNullField: nonNullField.join(','),
            },
          ),
          onCancel: () => {
            modal.destroy();
            throw new Error('取消保存');
          },
          onOk: () => {
            resolve({
              codeFormConfigList: dataList,
            });
          },
        });
      })
    : {
        codeFormConfigList: dataList,
      };
});

const headerReadonlyCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'readonly',
  false,
).checked;
const headerVisibleCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'visible',
).checked;
const headerHiddenCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'hidden',
  false,
).checked;
const headerUseCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'used',
  true,
).checked;
</script>

<template>
  <div class="h-full">
    <SmartTable v-bind="$attrs" :data="data">
      <template #table-readonly-header="{ column }">
        <Switch
          v-model:checked="headerReadonlyCheckboxChecked"
          :size="getFormSize as never"
        />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-visible-header="{ column }">
        <Switch
          v-model:checked="headerVisibleCheckboxChecked"
          :size="getFormSize as never"
        />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-hidden-header="{ column }">
        <Switch
          v-model:checked="headerHiddenCheckboxChecked"
          :size="getFormSize as never"
        />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-used-header="{ column }">
        <Switch
          v-model:checked="headerUseCheckboxChecked"
          :size="getFormSize as never"
        />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-rules="{ row }">
        <IconifyIcon
          v-if="
            row.autoValidate === true ||
            (row.ruleList && row.ruleList.length > 0)
          "
          class="anticon"
          color="red"
          icon="ant-design:info-circle-outlined"
        />
        <SmartIconButton
          :size="getButtonSize as never"
          @click="() => openRuleSetModal(row)"
        >
          设置规则
        </SmartIconButton>
      </template>
    </SmartTable>
    <RenderFormRuleSetModal />
  </div>
</template>

<style scoped></style>
