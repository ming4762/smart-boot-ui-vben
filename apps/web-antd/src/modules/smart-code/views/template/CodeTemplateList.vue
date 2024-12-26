<script setup lang="ts">
import { computed, ref, unref } from 'vue';

import {
  SmartLayoutSeparate,
  type SmartTableActionItem,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { warnMessage } from '#/utils';

import TemplateGroup from '../../components/template/TemplateGroup.vue';
import {
  deleteApi,
  getByIdApi,
  listApi,
  saveUpdateApi,
} from './CodeTemplateList.api';
import {
  getAddEditFormSchemas,
  getSearchSchemas,
  getTableColumns,
} from './CodeTemplateList.config';

const isReadonly = ref(false);
const currentGroupIdRef = ref<null | number>();

const [SmartTable, tableApi] = useSmartTable({
  id: 'smart-tool-code-templateList',
  customConfig: { storage: true },
  height: 'auto',
  stripe: true,
  showOverflow: 'tooltip',
  border: true,
  rowConfig: {
    isHover: true,
  },
  checkboxConfig: true,
  columnConfig: { resizable: true },
  columns: getTableColumns(),
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchSchemas(),
    searchWithSymbol: true,
    actionWrapperClass: 'text-left col-span-1 pb-2 ml-1.5',
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
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
    column: { columnOrder: true },
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        props: {
          onClick: () => {
            isReadonly.value = false;
            const currentGroupId = unref(currentGroupIdRef);
            if (!currentGroupId) {
              warnMessage(t('smart.code.views.template.notice.choseGroup'));
              return false;
            }
            tableApi.showAddModal(
              {},
              {
                groupId: currentGroupId,
              },
            );
          },
        },
      },
      {
        code: 'delete',
      },
    ],
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        const currentGroupId = unref(currentGroupIdRef);
        const groupParameter = currentGroupId
          ? { 'groupId@=': currentGroupId }
          : {};
        return listApi({
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            ...groupParameter,
          },
        });
      },
      save: ({ body: { insertRecords, updateRecords } }) =>
        saveUpdateApi([...insertRecords, ...updateRecords][0]),
      delete: ({ body: { removeRecords } }) =>
        deleteApi(removeRecords.map((item) => item.templateId)),
      getById: (params) => getByIdApi(params.templateId),
    },
  },
});

const getAddEditConfig = computed<any>(() => {
  return {
    modalConfig: {
      fullscreen: true,
      class: 'smart-code-template-list-modal',
    },
    formConfig: {
      schema: getAddEditFormSchemas(),
      commonConfig: {
        componentProps: {
          disabled: unref(isReadonly),
        },
      },
      wrapperClass: 'grid grid-cols-3',
    },
  };
});

const handleGroupChange = (id: null | number) => {
  currentGroupIdRef.value = id;
  tableApi.query();
};

const getActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('common.button.edit'),
      onClick: () => {
        isReadonly.value = false;
        tableApi.editByRowModal(row);
      },
    },
    {
      label: t('common.button.look'),
      onClick: () => {
        isReadonly.value = true;
        tableApi.editByRowModal(row);
      },
    },
  ];
};
</script>

<template>
  <div
    id="codeTemplateContainer"
    class="page-container smart-code-template-list h-full"
  >
    <SmartLayoutSeparate :show-line="false" class="h-full" first-size="240px">
      <template #first>
        <div class="bg-background h-full" style="margin-right: 5px">
          <TemplateGroup @change="handleGroupChange" />
        </div>
      </template>
      <template #second>
        <SmartTable :add-edit-config="getAddEditConfig">
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getActions(row)" />
          </template>
        </SmartTable>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style lang="less" scoped>
.smart-code-template-list {
  .code-container {
    .ant-form {
      height: 100%;
    }

    .ant-col-24 {
      height: calc(100% - 106px);

      .ant-form-item {
        height: 100%;
        overflow: auto;
      }
    }
  }

  .code-edit-container {
    height: 100%;
  }
}
</style>
