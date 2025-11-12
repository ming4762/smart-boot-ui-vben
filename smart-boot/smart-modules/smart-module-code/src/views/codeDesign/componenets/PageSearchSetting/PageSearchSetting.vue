<script setup lang="ts">
import { ref, toRaw, unref, watchEffect } from 'vue';

import { useSizeSetting } from '@vben/hooks';
import { $t } from '@vben/locales';

import { Switch } from 'ant-design-vue';

import { getTableBooleanColumnClass, useSmartTable } from '@vben/common-ui';

import { getControlList, SEARCH_SYMBOL_LIST } from '../../constants';
import {
  injectCodeDesignContext,
  injectCodeDesignHandler,
} from '../../useContext';
import { vueTableHeaderCheckboxSupport } from '../PageSettingSupport';

const { getFormSize } = useSizeSetting();

const { contextData } = injectCodeDesignContext();
const { registerSaveDataHandler } = injectCodeDesignHandler();

const [SmartTable] = useSmartTable({
  useSearchForm: false,
  align: 'center',
  stripe: true,
  rowConfig: {
    isHover: true,
    useKey: true,
    drag: true,
  },
  editConfig: {
    trigger: 'click',
    mode: 'row',
  },
  border: true,
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
      // slots: {
      //   default: 'table-controlType',
      // },
    },
    {
      title: '{smart.code.views.formSetting.title.readonly}',
      ...getTableBooleanColumnClass('readonly', false),
      field: 'readonly',
      width: 130,
      editRender: {
        name: 'ASwitch',
      },
      slots: {
        header: 'table-readonly-header',
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.visible}',
      ...getTableBooleanColumnClass('visible', false),
      field: 'visible',
      width: 130,
      editRender: {
        name: 'ASwitch',
      },
      slots: {
        header: 'table-visible-header',
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.hidden}',
      ...getTableBooleanColumnClass('hidden', false),
      field: 'hidden',
      width: 130,
      editRender: {
        name: 'ASwitch',
      },
      slots: {
        header: 'table-hidden-header',
      },
    },
    {
      title: '{smart.code.views.formSetting.title.used}',
      ...getTableBooleanColumnClass('used', false),
      field: 'used',
      width: 150,
      editRender: {
        name: 'ASwitch',
      },
      slots: {
        header: 'table-used-header',
      },
    },
    {
      title: '{smart.code.views.searchSetting.title.searchSymbol}',
      field: 'searchSymbol',
      width: 120,
      editRender: {
        name: 'ASelect',
        props: {
          class: 'w-[100px]',
          options: SEARCH_SYMBOL_LIST.map((item) => {
            return {
              label: item,
              value: item,
            };
          }),
        },
      },
    },
    {
      title: '{smart.code.views.formSetting.title.useTableSearch}',
      field: 'useTableSearch',
      ...getTableBooleanColumnClass('useTableSearch', false),
      width: 120,
      editRender: {
        name: 'ASwitch',
      },
    },
    {
      title: '{smart.code.views.codeManager.table.tableName}',
      field: 'tableName',
      width: 120,
      editRender: {
        name: 'AInput',
        props: ({ row }) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
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
            disabled: !(row.useTableSearch && row.visible),
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
            disabled: !(row.useTableSearch && row.visible),
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
      title: '{smart.code.views.codeManager.table.remarks}',
      field: 'remarks',
      minWidth: 160,
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
  const tableDataMap = new Map<string, any>();
  tableData.forEach((item) => {
    tableDataMap.set(item.javaProperty, item);
  });
  if (editData) {
    return editData.filter((item) => tableDataMap.has(item.javaProperty));
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
      searchSymbol: '=',
      rules: [],
      useTableSearch: false,
    });
  });
};

const dataList = ref<Array<any>>([]);
watchEffect(() => {
  dataList.value = createDataFromTableData(
    unref(contextData).tableData,
    unref(contextData).editConfigData?.codeSearchConfigList,
  );
});

registerSaveDataHandler(() => {
  return {
    codeSearchConfigList: toRaw(unref(dataList)),
  };
});

const headerReadonlyCheckboxChecked = vueTableHeaderCheckboxSupport(
  dataList,
  'readonly',
  false,
).checked;
const headerVisibleCheckboxChecked = vueTableHeaderCheckboxSupport(
  dataList,
  'visible',
).checked;
const headerHiddenCheckboxChecked = vueTableHeaderCheckboxSupport(
  dataList,
  'hidden',
  false,
).checked;
const headerUseCheckboxChecked = vueTableHeaderCheckboxSupport(
  dataList,
  'used',
  true,
).checked;
</script>

<template>
  <div class="h-full">
    <SmartTable v-bind="$attrs" :data="dataList">
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
    </SmartTable>
  </div>
</template>

<style scoped></style>
