<script setup lang="ts">
import type { SmartTableActionItem } from '@vben/common-ui';

import { computed, ref, unref } from 'vue';

import {
  SmartLayoutSeparate,
  SmartVxeTableAction,
  useSmartTable,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { warnMessage } from '@smart/common/utils';

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
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    schema: getSearchSchemas(),
    searchWithSymbol: true,
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
    custom: true,
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
    <SmartLayoutSeparate draggable class="h-full" first-size="240px">
      <template #first>
        <div class="bg-background h-full">
          <TemplateGroup @change="handleGroupChange" />
        </div>
      </template>
      <template #second>
        <SmartTable
          class="smart-table-padding"
          :add-edit-config="getAddEditConfig"
        >
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
