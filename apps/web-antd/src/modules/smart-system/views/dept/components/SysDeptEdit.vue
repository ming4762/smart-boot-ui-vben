<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import { Spin } from 'ant-design-vue';

import { useVbenForm, type VbenFormSchema } from '#/adapter/form';
import { $t as t } from '#/locales';

import { getByIdApi } from '../SysDept.api';

interface Props {
  filterField?: boolean;
  deptId?: number;
  size?: string;
}

const props = defineProps<Props>();

const getLoading = ref(false);

const formSchemas: Array<{ filter?: boolean } & VbenFormSchema> = [
  {
    label: '',
    fieldName: 'deptId',
    component: 'Input',
    dependencies: {
      triggerFields: ['deptId'],
      show: false,
    },
  },
  {
    label: '',
    fieldName: 'parentId',
    component: 'Input',
    dependencies: {
      triggerFields: ['parentId'],
      show: false,
    },
  },
  {
    label: t('system.views.dept.title.parent'),
    fieldName: 'parentName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    // filter: true,
  },
  {
    label: t('system.views.dept.title.deptCode'),
    fieldName: 'deptCode',
    component: 'Input',
    rules: 'required',
  },
  {
    label: t('system.views.dept.title.deptType'),
    fieldName: 'deptType',
    component: 'ApiDictSelect',
    rules: 'required',
    controlClass: 'w-full',
    componentProps: {
      dictCode: 'SYSTEM_ORGANIZATION_TYPE',
    },
  },
  {
    label: t('system.views.dept.title.deptName'),
    fieldName: 'deptName',
    rules: 'required',
    component: 'Input',
  },
  {
    label: t('common.title.useYn'),
    fieldName: 'useYn',
    component: 'Switch',
    defaultValue: true,
  },
  {
    label: t('system.views.dept.title.email'),
    fieldName: 'email',
    component: 'Input',
  },
  {
    label: t('system.views.dept.title.director'),
    fieldName: 'director',
    component: 'Input',
  },
  {
    label: t('system.views.dept.title.phone'),
    fieldName: 'phone',
    component: 'Input',
  },
  {
    label: t('common.table.seq'),
    fieldName: 'seq',
    component: 'InputNumber',
    controlClass: 'w-full',
    defaultValue: 1,
    rules: 'required',
  },
  {
    label: t('common.table.remark'),
    fieldName: 'remark',
    component: 'Textarea',
  },
  {
    label: t('common.table.createUser'),
    fieldName: 'createBy',
    component: 'Input',
    filter: true,
    componentProps: {
      disabled: true,
    },
  },
  {
    label: t('common.table.createTime'),
    fieldName: 'createTime',
    component: 'Input',
    filter: true,
    componentProps: {
      disabled: true,
    },
  },
  {
    label: t('common.table.updateUser'),
    fieldName: 'updateBy',
    component: 'Input',
    filter: true,
    componentProps: {
      disabled: true,
    },
  },
  {
    label: t('common.table.updateTime'),
    fieldName: 'updateTime',
    component: 'Input',
    filter: true,
    componentProps: {
      disabled: true,
    },
  },
];

const getFormSchemas = () => {
  if (!props.filterField) {
    return formSchemas;
  }
  return formSchemas.filter(
    (item) => item.filter === undefined || !item.filter,
  );
};

const [VbenForm, formApi] = useVbenForm({
  schema: getFormSchemas(),
  commonConfig: {
    componentProps: {
      size: props.size,
    },
  },
  showDefaultActions: false,
});

watch(
  () => props.deptId,
  (value) => {
    nextTick(async () => {
      if (value) {
        try {
          getLoading.value = true;
          const deptData = await getByIdApi(value);
          deptData.parentName = deptData.parentDept
            ? deptData.parentDept.deptName
            : 'root';
          formApi.setValues(deptData);
        } finally {
          getLoading.value = false;
        }
      } else {
        formApi.resetForm();
      }
    });
  },
);

defineExpose({
  setValues: formApi.setValues,
  resetForm: formApi.resetForm,
  validateAndGet: async () => {
    const { valid } = await formApi.validate();
    if (!valid) {
      throw new Error('error submit!');
    }
    return await formApi.getValues();
  },
});
</script>

<template>
  <Spin :spinning="getLoading">
    <VbenForm />
  </Spin>
</template>

<style scoped></style>
