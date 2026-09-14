<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  ResizableLayout,
  SmartCropperImage,
  useVbenForm,
} from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { getCurrentUserInfo } from '@smart/common/api';

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

const imageRef = ref('');
const handleCropEnd = ({ imgBase64 }: any) => {
  imageRef.value = imgBase64;
};
</script>

<template>
  <Container
    class="h-full"
    :title="t('ui.widgets.personalCenter.basicInfo.title')"
  >
    <ResizableLayout
      class="h-full"
      :first-size="50"
      :resizable="false"
      :show-handle="false"
    >
      <template #first>
        <Form />
      </template>
      <template #second>
        <SmartCropperImage
          show-preview
          @cropend="handleCropEnd"
          show-toolbar
          img-src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp"
        />
      </template>
    </ResizableLayout>
  </Container>
</template>

<style scoped></style>
