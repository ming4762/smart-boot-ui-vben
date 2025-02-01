<script setup lang="ts">
import { onMounted } from 'vue';

import { SmartLayoutSeparate } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { useVbenForm } from '#/adapter/form';
import { getCurrentUserInfo } from '#/api';

import Container from './container.vue';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 70,
  },
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'fullName',
      component: 'Input',
      label: t('ui.widgets.personalCenter.basicInfo.fullName'),
      rules: 'required',
    },
    {
      fieldName: 'email',
      component: 'Input',
      label: t('ui.widgets.personalCenter.basicInfo.email'),
    },
    {
      fieldName: 'phone',
      component: 'Input',
      label: t('ui.widgets.personalCenter.basicInfo.phone'),
    },
  ],
});
const loadUserData = async () => {
  const userInfo = await getCurrentUserInfo();
  formApi.setValues(userInfo);
};
onMounted(() => {
  loadUserData();
});
</script>

<template>
  <Container
    class="h-full"
    :title="t('ui.widgets.personalCenter.basicInfo.title')"
  >
    <SmartLayoutSeparate first-size="50%" :show-line="false" class="h-full">
      <template #first>
        <Form />
      </template>
      <template #second>12312 </template>
    </SmartLayoutSeparate>
  </Container>
</template>

<style scoped></style>
