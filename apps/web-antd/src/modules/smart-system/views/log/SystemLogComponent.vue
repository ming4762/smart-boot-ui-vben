<script setup lang="ts">
import type { LoginIdent } from './SystemLogComponent.config';

import type { SmartTableActionItem } from '#/adapter/smart-table';

import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { Tag } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { SmartVxeTableAction, useSmartTable } from '#/adapter/smart-table';
import { SysTenantSelect } from '#/components';

import LogDetailModal from './components/LogDetailModal.vue';
import { listApi } from './SystemLogComponent.api';
import {
  getSearchFormSchemas,
  getTableColumns,
} from './SystemLogComponent.config';

interface Props {
  ident: LoginIdent;
}

const props = defineProps<Props>();

const { getIsPlatformTenant } = storeToRefs(useUserStore());

const getClass = computed(() => {
  if (props.ident === 'INTERFACE_LOG') {
    return ['two-search'];
  }
  return [];
});

const [Modal, modalApi] = useVbenModal({
  connectedComponent: LogDetailModal,
});

const [SmartTable] = useSmartTable({
  customConfig: { storage: true },
  columns: getTableColumns(props.ident),
  height: 'auto',
  border: true,
  rowConfig: {
    isHover: true,
  },
  stripe: true,
  showOverflow: 'tooltip',
  pagerConfig: true,
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    schema: getSearchFormSchemas(props.ident, getIsPlatformTenant),
    compact: true,
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
    },
    searchWithSymbol: true,
  },
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'createTime',
      order: 'desc',
    },
  },
  columnConfig: {
    resizable: true,
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    sizeSetting: true,
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        const params = {
          ...ajaxParameter,
          parameter: {
            ...ajaxParameter?.parameter,
            'ident@=': props.ident,
          },
        };
        return listApi(params);
      },
    },
  },
});

const getTableActions = (row: any): SmartTableActionItem[] => {
  return [
    {
      label: t('common.title.details'),
      preIcon: 'ant-design:bars-outlined',
      onClick: () => {
        modalApi.setData(row.logId);
        modalApi.open();
      },
    },
  ];
};

/**
 * 获取使用时间tag颜色
 * @param useTime 时长
 */
const getUseTimeTagColor = (useTime: number) => {
  if (useTime <= 300) {
    return 'blue';
  }
  if (useTime <= 500) {
    return 'green';
  }
  if (useTime <= 1000) {
    return 'orange';
  }
  return 'pink';
};
</script>

<template>
  <div :class="getClass" class="smart-table-padding page-container h-full">
    <SmartTable v-bind="$attrs">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
      <template #table-statusCode="{ row }">
        <Tag
          :color="
            row.statusCode >= 200 && row.statusCode < 300 ? '#2db7f5' : '#f50'
          "
        >
          {{ row.statusCode }}
        </Tag>
      </template>
      <template #table-useTime="{ row }">
        <Tag
          v-if="row.useTime !== null"
          :color="getUseTimeTagColor(row.useTime)"
        >
          {{ row.useTime }}
        </Tag>
      </template>
      <template #search-tenantId="{ model, size }">
        <SysTenantSelect
          v-model:value="model.tenantId"
          :size="size"
          allow-clear
          style="width: 100px"
        />
      </template>
    </SmartTable>
    <Modal />
  </div>
</template>

<style lang="less" scoped>
.two-search {
  :deep(.smart-table-container) {
    height: calc(100% - 120px) !important;
  }
}
</style>
