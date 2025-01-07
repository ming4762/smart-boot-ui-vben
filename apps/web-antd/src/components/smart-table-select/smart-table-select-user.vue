<script setup lang="ts">
import type { SmartTableProps } from '#/adapter/smart-table';

import type {
  SmartTableSelectModalProps,
  SmartTableSelectProps,
} from '../type';

import { listUserApi, listUserByIdApi } from '#/api';
import { $ct as t } from '@vben/locales';
import { computed, unref, useAttrs } from 'vue';

import SmartTableSelect from './smart-table-select.vue';

type Props = {
  parameterHandler?: (parameter?: Record<string, any>) => Record<string, any>;
} & SmartTableSelectModalProps &
  SmartTableSelectProps;

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Partial<Props>>(), {
  labelField: 'fullName',
  valueField: 'userId',
  multiple: true,
  parameterHandler: undefined,
  listApi: listUserByIdApi,
});

const attrs = useAttrs();

const tableProps: SmartTableProps = {
  pagerConfig: true,
  useSearchForm: true,
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        let parameter = ajaxParameter;
        if (props.parameterHandler) {
          parameter = props.parameterHandler(ajaxParameter);
        }
        return listUserApi(parameter);
      },
    },
  },
  // checkboxConfig: {
  //   rowTrigger: 'multiple',
  //   highlight: true,
  // },
  rowConfig: {
    isHover: true,
  },
  searchFormConfig: {
    compact: true,
    searchWithSymbol: true,
    actionWrapperClass: 'text-left',
    wrapperClass: 'flex flex-wrap',
    schema: [
      {
        label: t('system.views.user.table.fullName'),
        fieldName: 'fullName',
        component: 'Input',
        searchSymbol: 'like',
      },
    ],
  },
  columns: [
    // {
    //   type: 'checkbox',
    //   width: 60,
    //   align: 'center',
    //   fixed: 'left',
    // },
    {
      title: '{system.views.user.table.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.fullName}',
      field: 'fullName',
      minWidth: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.userType}',
      field: 'userType',
      width: 120,
    },
  ],
};

const computedProps = computed(() => {
  return {
    title: t('component.smartTableSelect.button.chooseUser'),
    fullscreen: true,
    ...unref(props),
    ...attrs,
    tableProps: props.tableProps || tableProps,
  };
});
</script>

<template>
  <SmartTableSelect v-bind="computedProps" />
</template>

<style scoped></style>
