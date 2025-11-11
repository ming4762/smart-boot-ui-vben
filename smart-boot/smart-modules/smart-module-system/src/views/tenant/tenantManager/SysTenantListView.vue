<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed, onMounted, ref, unref } from 'vue';

import { useSmartTable } from '@vben/common-ui';
import { useInjectPageDict } from '@vben/preferences';

import dayjs from 'dayjs';

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
  return unref(pageDictMap).get(SYSTEM_TENANT_TYPE_DICT) || new Map();
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
  stripe: true,
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
    schema: getSearchFormSchemas(isolationStrategyListRef),
    searchWithSymbol: true,
    commonConfig: {
      labelWidth: 90,
    },
    actionWrapperClass: 'gap-x-2',
    compact: true,
    layout: 'inline',
    // wrapperClass: 'grid grid-cols-5',
    actionLayout: 'inline',
    actionPosition: 'left',
  },
  addEditConfig: {
    modalConfig: {
      class: 'w-[900px]',
      destroyOnClose: false,
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
      save: ({ body: { insertRecords, updateRecords } }) => {
        const data = [...insertRecords, ...updateRecords][0];
        if (data.effectExpireTime && data.effectExpireTime.length > 0) {
          data.effectTime = data.effectExpireTime[0];
          data.expireTime = data.effectExpireTime[1];
        }
        delete data.effectExpireTime;
        return saveUpdateApi(data);
      },
      delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
      getById: async (params) => {
        const data = await getByIdApi(params.id);
        if (!data || !data.effectTime || !data.expireTime) {
          return data;
        }
        return {
          ...data,
          effectExpireTime: [dayjs(data.effectTime), dayjs(data.expireTime)],
        };
      },
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
  <div class="smart-table-padding page-container system-tenant-manager h-full">
    <SmartTable @current-change="handleCurrentChange">
      <template #table-isolationStrategy="{ row }">
        <span>{{ computedIsolationStrategyMap[row.isolationStrategy] }}</span>
      </template>
      <template #table-type="{ row }">
        <span>{{ computedTenantTypeDictMap.get(row.type) }}</span>
      </template>
    </SmartTable>
    <!--    <SmartLayoutSeparate-->
    <!--      class="h-full"-->
    <!--      draggable-->
    <!--      first-size="45%"-->
    <!--      layout="topBottom"-->
    <!--    >-->
    <!--      <template #first>-->
    <!--        <SmartTable @current-change="handleCurrentChange">-->
    <!--          <template #table-isolationStrategy="{ row }">-->
    <!--            <span>{{-->
    <!--              computedIsolationStrategyMap[row.isolationStrategy]-->
    <!--            }}</span>-->
    <!--          </template>-->
    <!--          <template #table-type="{ row }">-->
    <!--            <span>{{ computedTenantTypeDictMap[row.type] }}</span>-->
    <!--          </template>-->
    <!--        </SmartTable>-->
    <!--      </template>-->
    <!--      <template #second>-->
    <!--        <Tabs class="bg-background">-->
    <!--          <TabPane-->
    <!--            key="user"-->
    <!--            :tab="t('system.views.tenant.manager.title.tabUser')"-->
    <!--          >-->
    <!--            <TenantUserList :tenant-id="currentTenantRef?.id" />-->
    <!--          </TabPane>-->
    <!--          <TabPane-->
    <!--            key="subscribe"-->
    <!--            :tab="t('system.views.tenant.manager.title.tabSubscribe')"-->
    <!--          >-->
    <!--            <TenantSubscribeList :tenant-id="currentTenantRef?.id" />-->
    <!--          </TabPane>-->
    <!--        </Tabs>-->
    <!--      </template>-->
    <!--    </SmartLayoutSeparate>-->
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
