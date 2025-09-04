<script setup lang="ts">
import type { AnyNormalFunction } from '@vben/types';

import { onMounted, watch } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { useSmartTable } from '#/adapter/smart-table';
import { ApiServiceEnum, requestClient } from '#/api/request';

import TemplateGroup from '../../../components/template/TemplateGroup.vue';
import { TemplateType as templateTypeConstants } from '../../../constants/DatabaseConstants';

interface Props {
  addSelectData?: AnyNormalFunction<any[], void>;
  removeSelectData?: AnyNormalFunction<any[], void>;
  selectData?: any[];
  registerHandler: AnyNormalFunction<any[], void>;
}

const props = defineProps<Props>();

let currentGroupId: null | number = null;

const [SmartTable, tableApi] = useSmartTable({
  useSearchForm: true,
  border: true,
  height: 'auto',
  pagerConfig: true,
  rowConfig: {
    keyField: 'templateId',
  },
  columnConfig: {
    resizable: true,
  },
  showOverflow: 'tooltip',
  checkboxConfig: {
    rowTrigger: 'multiple',
    highlight: true,
  },
  searchFormConfig: {
    layout: 'inline',
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 90,
    },
    searchWithSymbol: true,
    schema: [
      {
        label: t('smart.code.views.template.table.name'),
        fieldName: 'name',
        component: 'Input',
      },
    ],
  },
  proxyConfig: {
    ajax: {
      query: ({ ajaxParameter }) => {
        let parameter = {};
        if (currentGroupId !== null) {
          parameter = { 'groupId@=': currentGroupId };
        }
        return requestClient.post(
          'db/code/template/list',
          {
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              ...parameter,
              'templateType@=': 'TEMPLATE_CODE',
            },
          },
          {
            service: ApiServiceEnum.SMART_CODE,
          },
        );
      },
    },
  },
  columns: [
    {
      type: 'checkbox',
      width: 60,
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'name',
      title: '{smart.code.views.template.table.name}',
      width: 240,
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'templateType',
      title: '{smart.code.views.template.table.templateType}',
      width: 140,
      formatter: ({ row }: any) => {
        const templateType = templateTypeConstants[row.templateType];
        if (templateType) {
          return t(templateType.label);
        }
        return '';
      },
    },
    {
      field: 'language',
      title: '{smart.code.views.template.table.language}',
      width: 200,
    },
    {
      field: 'remark',
      title: '{smart.code.views.template.table.remark}',
      minWidth: 200,
      align: 'left',
      headerAlign: 'center',
    },
  ],
});

const handleCurrentChange = (groupId: number) => {
  currentGroupId = groupId;
  tableApi.query();
};

const handleCheckboxChange = ({ checked, row }: any) => {
  if (checked) {
    props.addSelectData && props.addSelectData([row]);
  } else {
    props.removeSelectData && props.removeSelectData([row]);
  }
};

const handleCheckboxAll = ({ checked }: any) => {
  const selectRows = tableApi.getGrid().getCheckboxRecords();
  if (checked) {
    props.removeSelectData && props.removeSelectData(props.selectData);
    props.addSelectData && props.addSelectData(selectRows);
  } else {
    props.removeSelectData && props.removeSelectData(props.selectData);
  }
};

const resetCheckbox = async () => {
  const grid = tableApi.getGrid();
  // 数据重新加载后，设置选中的数据
  grid.setAllCheckboxRow(false);
  grid.setCheckboxRow(props.selectData, true);
};

onMounted(() => {
  props.registerHandler &&
    props.registerHandler({
      getData: () => tableApi.getGrid().getCheckboxRecords(),
    });
});

watch(
  () => props.selectData,
  () => {
    resetCheckbox();
  },
);
</script>

<template>
  <SmartLayoutSeparate :show-line="false" class="h-full" first-size="200px">
    <template #first>
      <TemplateGroup
        :editable="false"
        class="full-height"
        @change="handleCurrentChange"
      />
    </template>
    <template #second>
      <SmartTable
        @checkbox-all="handleCheckboxAll"
        @checkbox-change="handleCheckboxChange"
        @proxy-query="resetCheckbox"
      />
    </template>
  </SmartLayoutSeparate>
</template>

<style scoped></style>
