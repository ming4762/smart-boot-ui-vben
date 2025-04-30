<script setup lang="ts">
import { ref, toRaw, unref, watchEffect } from 'vue';

import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { Switch } from 'ant-design-vue';

import {
  getTableBooleanColumnClass,
  useSmartTable,
} from '#/adapter/smart-table';
import { vueTableHeaderCheckboxSupport } from '#/modules/smart-code/views/codeDesign/componenets/PageSettingSupport';

import {
  injectCodeDesignContext,
  injectCodeDesignHandler,
} from '../../useContext';

const { contextData } = injectCodeDesignContext();

const { registerSaveDataHandler } = injectCodeDesignHandler();

const { getFormSize } = useSizeSetting();

/**
 * copy列
 */
const copyField = [
  'columnName',
  'javaProperty',
  'javaType',
  'typeName',
  'columnSize',
  'decimalDigits',
  'columnDef',
  'nullable',
  'remarks',
  'primaryKey',
  'indexed',
  'tableName',
  'extType',
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
    const tableDataMap: Record<string, any> = {};
    tableData.forEach((item) => {
      tableDataMap[item.javaProperty] = item;
    });
    return editData.map((item) => {
      const itemData = {
        ...item,
      };
      const tableDataItem = tableDataMap[item.javaProperty] || {};
      copyField.forEach((field) => {
        itemData[field] = tableDataItem[field];
      });
      return itemData;
    });
  }
  return tableData.map((item) => {
    const data: any = {};
    copyField.forEach((field) => {
      data[field] = item[field];
    });
    // 获取align
    let align = 'left';
    const typeName = item.typeName;
    if (['DATE', 'DATETIME', 'TIME'].includes(typeName)) {
      align = 'center';
    }
    if (['BIGINT', 'INT', 'LONG', 'NUMBER', 'NUMERIC'].includes(typeName)) {
      align = 'right';
    }
    return Object.assign(data, {
      title:
        data.remarks && data.remarks.trim() !== ''
          ? data.remarks
          : data.javaProperty,
      sortable: false,
      fixed: null,
      width: 120,
      align,
      resizable: false,
      visible: true,
      hidden: false,
      format: '',
      // 是否可编辑
      editable: false,
    });
  });
};

const data = ref<Array<any>>([]);

watchEffect(() => {
  data.value = createDataFromTableData(
    unref(contextData).tableData,
    unref(contextData).editConfigData?.codePageConfigList,
  );
});

registerSaveDataHandler(() => {
  return {
    codePageConfigList: toRaw(unref(data)),
  };
});

const [SmartTable] = useSmartTable({
  useSearchForm: false,
  rowConfig: {
    isHover: true,
    drag: true,
  },
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
      title: '{smart.code.views.tableField.title.remarks}',
      field: 'remarks',
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
        autofocus: true,
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.sortable}',
      ...getTableBooleanColumnClass('sortable', false),
      field: 'sortable',
      width: 130,
      editRender: {
        name: 'ASwitch',
        autofocus: true,
      },
      slots: {
        header: 'table-sortable-header',
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.fixed}',
      ...getTableBooleanColumnClass('fixed', false),
      field: 'fixed',
      width: 120,
      editRender: {
        name: 'ASelect',
        autofocus: true,
        props: {
          class: 'w-[100px]',
          options: [
            {
              label: 'left',
              value: 'left',
            },
            {
              label: 'right',
              value: 'right',
            },
          ],
        },
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.width}',
      field: 'width',
      width: 120,
      editRender: {
        name: 'AInput',
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.align}',
      field: 'align',
      width: 120,
      dynamicClass: ({ row }) => {
        const value = row.align;
        switch (value) {
          case 'center': {
            return 'text-center';
          }
          case 'left': {
            return 'text-left';
          }
          case 'right': {
            return 'text-right';
          }
          // No default
        }
        return '';
      },
      editRender: {
        name: 'ASelect',
        props: {
          class: 'w-[100px]',
          options: [
            {
              label: 'left',
              value: 'left',
            },
            {
              label: 'center',
              value: 'center',
            },
            {
              label: 'right',
              value: 'right',
            },
          ],
        },
      },
    },
    {
      title: '{smart.code.views.tableSetting.title.resizable}',
      field: 'resizable',
      ...getTableBooleanColumnClass('resizable', false),
      width: 130,
      slots: {
        header: 'table-resizable-header',
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
      title: '{smart.code.views.tableSetting.title.editable}',
      ...getTableBooleanColumnClass('editable', false),
      field: 'editable',
      width: 140,
      editRender: {
        name: 'ASwitch',
      },
      slots: {
        header: 'table-editable-header',
      },
    },
  ],
});

const headerSortableCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'sortable',
  false,
).checked;

const headerResizableCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'resizable',
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
const headerEditableCheckboxChecked = vueTableHeaderCheckboxSupport(
  data,
  'editable',
  false,
).checked;
</script>

<template>
  <div class="h-full">
    <SmartTable :data="data" v-bind="$attrs">
      <template #table-sortable-header="{ column }">
        <Switch
          v-model:checked="headerSortableCheckboxChecked"
          :size="getFormSize as never"
        />
        {{ t(column.title.replace('{', '').replace('}', '')) }}
      </template>
      <template #table-resizable-header="{ column }">
        <Switch
          v-model:checked="headerResizableCheckboxChecked"
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
      <template #table-editable-header="{ column }">
        <Switch
          v-model:checked="headerEditableCheckboxChecked"
          :size="getFormSize as never"
        />
        {{ $t(column.title.replace('{', '').replace('}', '')) }}
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
