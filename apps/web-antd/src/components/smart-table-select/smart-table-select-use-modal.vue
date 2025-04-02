<script setup lang="ts">
import type { SmartTableProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { reactive } from 'vue';

import { ApiServiceEnum } from '@vben/constants';
import { $t as t } from '@vben/locales';

import { requestClient } from '#/api/request';

import SmartTableSelectModal from './smart-table-select-modal.vue';

interface Props {
  listUserApi?: (parameter: any) => Promise<any>;
}

const props = withDefaults(defineProps<Props>(), {
  listUserApi: async (parameter: any) => {
    return requestClient.post('sys/user/list', parameter, {
      service: ApiServiceEnum.SMART_SYSTEM,
    });
  },
});

const emit = defineEmits<{
  selected: [any[]];
  'update:selectValues': [any[]];
}>();

const listApi = async (data: any) => {
  return requestClient.post('sys/user/listById', data, {
    service: ApiServiceEnum.SMART_SYSTEM,
  });
};

const handleSelectData = (options: Recordable<any>) => {
  const userIdList = options.map((item: any) => item.value);
  emit('update:selectValues', userIdList);
  emit('selected', userIdList);
};

const commonTableProps: SmartTableProps = {
  pagerConfig: true,
  height: 'auto',
  useSearchForm: false,
  columns: [
    {
      title: '{component.smartTableSelect.user.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{component.smartTableSelect.user.fullName}',
      field: 'fullName',
      minWidth: 120,
      fixed: 'left',
    },
    {
      title: '{component.smartTableSelect.user.userType}',
      field: 'userType',
      width: 120,
    },
  ],
};

const tableProps = reactive<SmartTableProps>({
  ...commonTableProps,
  useSearchForm: true,
  checkboxConfig: {
    rowTrigger: 'multiple',
  },
  searchFormConfig: {
    actionWrapperClass: 'text-left col-span-1 pb-2 ml-1.5',
    wrapperClass: 'flex',
    searchWithSymbol: true,
    schema: [
      {
        label: t('component.smartTableSelect.user.fullName'),
        fieldName: 'fullName',
        component: 'Input',
        searchSymbol: 'like',
      },
    ],
    commonConfig: {
      labelWidth: 60,
      formItemClass: 'pb-2',
    },
  },
  proxyConfig: {
    ajax: {
      query: (params: any) => {
        const parameter = {
          ...params.ajaxParameter,
          'useYn@=': true,
        };
        return props.listUserApi(parameter);
      },
    },
  },
}) as SmartTableProps;
</script>

<template>
  <SmartTableSelectModal
    v-bind="$attrs"
    :list-api="listApi"
    :select-table-props="commonTableProps"
    :table-props="tableProps"
    label-field="fullName"
    value-field="userId"
    @select-data="handleSelectData"
  />
</template>

<style scoped></style>
