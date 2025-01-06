<script setup lang="ts">
import type { SmartTableActionItem } from '#/adapter/smart-table';
import type { Recordable } from '@vben/types';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { $ct as t } from '#/locales';
import { useAccess } from '@vben/access';
import { listToTree } from '@vben/utils';
import { Radio, RadioGroup, Tag, TreeSelect } from 'ant-design-vue';
import { nextTick, onMounted, reactive, ref, unref } from 'vue';

import {
  deleteApi,
  getByIdApi,
  listApi,
  saveApi,
} from './FunctionListView.api';
import {
  getAddEditForm,
  getSearchSchemas,
  Permission,
  tableColumns,
} from './FunctionListView.config';

const { hasAccessByAuth } = useAccess();

const currentRowRef = ref<any>({});

const defaultFunctionTypes = () => {
  return {
    catalogue: {
      value: 'CATALOG',
      label: t('system.views.function.common.catalogue'),
      disabled: false,
    },
    menu: {
      value: 'MENU',
      label: t('system.views.function.common.menu'),
      disabled: false,
    },
    function: {
      value: 'FUNCTION',
      label: t('system.views.function.common.function'),
      disabled: false,
    },
  };
};
const functionTypes: any = reactive(defaultFunctionTypes());
/**
 * 设置不可用类型
 * @param keys
 */
const setTypeDisabled = (keys: Array<string>) => {
  Object.keys(functionTypes).forEach((key) => {
    functionTypes[key].disabled = keys.includes(key);
  });
};

const functionTreeData = ref<Recordable<any>[]>([]);
const loadFunctionTreeData = async () => {
  functionTreeData.value = await listApi({
    parameter: {
      'functionType@in': ['10', '20'],
    },
  });
};
onMounted(() => loadFunctionTreeData());

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-system-function-functionList',
  columns: tableColumns,
  resizableConfig: {},
  border: true,
  align: 'left',
  height: 'auto',
  useSearchForm: true,
  customConfig: {
    storage: true,
  },
  searchFormConfig: {
    actionWrapperClass: 'text-left',
    compact: true,
    wrapperClass: 'flex flex-wrap',
    schema: getSearchSchemas(),
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
      formItemClass: 'pb-2',
    },
    searchWithSymbol: true,
  },
  columnConfig: {
    resizable: true,
    isHover: true,
  },
  treeConfig: {
    reserve: true,
  },
  rowConfig: {
    keyField: 'functionId',
  },
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  addEditConfig: {
    modalConfig: {
      class: 'w-[860px]',
    },
    formConfig: {
      wrapperClass: 'grid grid-cols-2',
      commonConfig: {
        // formItemClass: 'pb-2',
      },
      schema: getAddEditForm(),
    },
    afterSave: () => {
      nextTick(() => loadFunctionTreeData());
      tableApi.query();
      return true;
    },
  },
  proxyConfig: {
    ajax: {
      query: async ({ ajaxParameter }) => {
        const parameter = {
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            // 'parentId@=': 0,
          },
        };
        return listToTree(
          (await listApi(parameter)) || [],
          (row: any) => row.functionId,
          (row: any) => row.parentId,
          0,
        );
      },
      delete: (params) => deleteApi(params),
      save: saveApi,
      getById: getByIdApi,
    },
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        props: {
          onClick: () => {
            setTypeDisabled(['function']);
            tableApi.showAddModal(
              {},
              {
                isTopAdd: true,
                parentId: 0,
              },
            );
          },
        },
      },
    ],
  },
});

const getTagData = (functionType: string) => {
  switch (functionType) {
    case 'CATALOG': {
      return {
        color: '#f50',
        text: t('system.views.function.common.catalogue'),
      };
    }
    case 'FUNCTION': {
      return {
        color: '#108ee9',
        text: t('system.views.function.common.function'),
      };
    }
    case 'MENU': {
      return {
        color: '#2db7f5',
        text: t('system.views.function.common.menu'),
      };
    }
    default: {
      return {
        text: '',
      };
    }
  }
};

const getTableActions = (row: Recordable<any>): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.add'),
      icon: 'ant-design:plus-outlined',
      disabled:
        row.functionType === 'FUNCTION' || !hasAccessByAuth(Permission.add),
      onClick: () => {
        currentRowRef.value = row;
        const data: Recordable<any> = {
          parentId: row.functionId,
          parentName: row.functionName,
        };
        const functionType = row.functionType;
        switch (functionType) {
          case 'CATALOG': {
            setTypeDisabled(['function']);
            break;
          }
          case 'FUNCTION': {
            setTypeDisabled(['catalogue', 'menu', 'function']);
            break;
          }
          case 'MENU': {
            setTypeDisabled(['catalogue', 'menu']);
            data.functionType = 'FUNCTION';
            break;
          }
        }
        tableApi.showAddModal(row, data);
      },
    },
    {
      code: 'edit',
      icon: 'ant-design:edit-outlined',
      auth: Permission.update,
      onClick: () => {
        currentRowRef.value = row;
        setTypeDisabled(['catalogue', 'menu', 'function']);
        tableApi.editByRowModal(row);
      },
    },
    {
      label: t('common.button.delete'),
      icon: 'ant-design:delete-outlined',
      danger: true,
      auth: Permission.delete,
      onClick: () => {
        currentRowRef.value = row;
        tableApi.deleteByRow(row);
      },
    },
  ];
};

const getTreeData = (model: Recordable<any>) => {
  const { functionType, isTopAdd } = model;
  let treeData: Recordable<any>[] = [];
  if (isTopAdd !== true) {
    const dataList =
      functionType === 'CATALOG' || functionType === 'MENU'
        ? unref(functionTreeData)
            .filter((item) => item.functionType === 'CATALOG')
            .map((item) => {
              return {
                ...item,
              };
            })
        : unref(functionTreeData).map((item) => {
            return {
              ...item,
            };
          });
    if (dataList.length > 0) {
      treeData =
        listToTree(
          dataList,
          (row) => row.functionId,
          (row) => row.parentId,
          0,
        ) || [];
    }
  }
  return [
    {
      functionId: 0,
      functionName: '根目录',
      children: treeData,
      functionType: 'CATALOG',
    },
  ];
};
</script>

<template>
  <div class="page-container h-full">
    <SmartTable>
      <template #table-functionType="{ row }">
        <Tag :color="getTagData(row.functionType).color">
          {{ getTagData(row.functionType).text }}
        </Tag>
      </template>
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
      <template #addEditForm-functionType="{ model, size }">
        <RadioGroup v-model:value="model.functionType" :size="size">
          <Radio
            v-for="(type, key) in functionTypes"
            :key="key"
            :disabled="type.disabled"
            :value="type.value"
          >
            {{ type.label }}
          </Radio>
        </RadioGroup>
      </template>
      <template #addEdit-parentId="{ model, size }">
        <TreeSelect
          v-model:value="model.parentId"
          :field-names="{
            label: 'functionName',
            value: 'functionId',
            children: 'children',
          }"
          :size="size"
          :tree-data="getTreeData(model)"
        >
          <template #title="{ functionType, functionName }">
            <Tag :color="getTagData(functionType).color">
              {{ getTagData(functionType).text }}
            </Tag>
            {{ functionName }}
          </template>
        </TreeSelect>
      </template>
    </SmartTable>
  </div>
</template>

<style scoped></style>
