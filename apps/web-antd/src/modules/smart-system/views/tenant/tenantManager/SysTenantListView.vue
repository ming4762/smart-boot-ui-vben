<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { useSmartTable } from '#/adapter/smart-table';
import { SmartLayoutSeparate } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useInjectPageDict } from '@vben/preferences';
import { TabPane, Tabs } from 'ant-design-vue';
import { computed, onMounted, ref, unref } from 'vue';

import TenantSubscribeList from './components/TenantSubscribeList.vue';
import TenantUserList from './components/TenantUserList.vue';
import {
  deleteApi,
  getByIdApi,
  listApi,
  listIsolationStrategyApi,
  saveUpdateApi,
  setUseYnApi,
} from './SysTenantListView.api';
import {
  getFormSchemas,
  getSearchFormSchemas,
  getTableColumns,
  Permission,
  SYSTEM_TENANT_TYPE_DICT,
} from './SysTenantListView.config';

const isolationStrategyListRef = ref<any[]>([]);
const computedIsolationStrategyMap = computed(() => {
  const keyObject: Recordable<any> = {};
  unref(isolationStrategyListRef).forEach((item) => {
    keyObject[item.value] = item.label;
  });
  return keyObject;
});
const initIsolationStrategy = async () => {
  isolationStrategyListRef.value = await listIsolationStrategyApi();
};

const { pageDictMap, pageDictRegister } = useInjectPageDict();
const computedTenantTypeDictMap = computed(() => {
  return (unref(pageDictMap || {}) as any)[SYSTEM_TENANT_TYPE_DICT] || {};
});
onMounted(() => pageDictRegister(SYSTEM_TENANT_TYPE_DICT));

const currentTenantRef = ref<null | Recordable<any>>(null);
const handleCurrentChange = ({ row }: any) => {
  currentTenantRef.value = row;
};

const [SmartTable] = useSmartTable({
  id: 'system-tenant-manager',
  columns: getTableColumns(),
  height: 'auto',
  border: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  customConfig: { storage: true },
  showOverflow: 'tooltip',
  showHeaderOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  columnConfig: {
    resizable: true,
  },
  checkboxConfig: true,
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    schema: getSearchFormSchemas(),
    searchWithSymbol: true,
    commonConfig: {
      labelWidth: 90,
    },
    actionWrapperClass: 'col-span-1 text-left',
    compact: true,
    wrapperClass: 'grid grid-cols-4',
  },
  addEditConfig: {
    modalConfig: {
      class: 'w-[900px]',
    },
    formConfig: {
      schema: getFormSchemas(isolationStrategyListRef),
      commonConfig: {
        labelWidth: 90,
      },
      wrapperClass: 'grid-cols-2 grid',
    },
  },
  proxyConfig: {
    ajax: {
      query: async (params) => {
        if (unref(isolationStrategyListRef).length === 0) {
          await initIsolationStrategy();
        }
        return listApi(params.ajaxParameter);
      },
      save: ({ body: { insertRecords, updateRecords } }) =>
        saveUpdateApi([...insertRecords, ...updateRecords][0]),
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: (params) => getByIdApi(params.id),
      useYn: setUseYnApi,
    },
  },
  toolbarConfig: {
    zoom: true,
    refresh: true,
    custom: true,
    sizeSetting: true,
    buttons: [
      {
        code: 'ModalAdd',
        auth: Permission.save,
      },
      {
        code: 'ModalEdit',
        auth: Permission.update,
      },
      // {
      //   code: 'delete',
      //   auth: Permission.delete,
      // },
      {
        code: 'useYnTrue',
        auth: Permission.useYn,
      },
      {
        code: 'useYnFalse',
        auth: Permission.useYn,
      },
    ],
  },
});
</script>

<template>
  <div class="page-container system-tenant-manager h-full">
    <SmartLayoutSeparate
      class="h-full"
      draggable
      first-size="45%"
      layout="topBottom"
    >
      <template #first>
        <SmartTable @current-change="handleCurrentChange">
          <template #table-isolationStrategy="{ row }">
            <span>{{
              computedIsolationStrategyMap[row.isolationStrategy]
            }}</span>
          </template>
          <template #table-type="{ row }">
            <span>{{ computedTenantTypeDictMap[row.type] }}</span>
          </template>
        </SmartTable>
      </template>
      <template #second>
        <Tabs class="bg-background">
          <TabPane
            key="user"
            :tab="t('system.views.tenant.manager.title.tabUser')"
          >
            <TenantUserList :tenant-id="currentTenantRef?.id" />
          </TabPane>
          <TabPane
            key="subscribe"
            :tab="t('system.views.tenant.manager.title.tabSubscribe')"
          >
            <TenantSubscribeList :tenant-id="currentTenantRef?.id" />
          </TabPane>
        </Tabs>
      </template>
    </SmartLayoutSeparate>
  </div>
</template>

<style scoped lang="less">
.system-tenant-manager {
  :deep(.ant-tabs) {
    height: 100%;
  }
  :deep(.ant-tabs-nav-wrap) {
    margin-left: 10px;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
  :deep(.ant-tabs-nav) {
    margin-bottom: 5px;
  }
}
</style>
