<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { $ct as t } from '@vben/locales';
import { VbenTooltip } from '@vben-core/shadcn-ui';
import { computed, ref, unref } from 'vue';

interface Props {
  height: string;
  api: () => Promise<any>;
}

const props = withDefaults(defineProps<Props>(), {
  height: 'px',
});

const emit = defineEmits<{ afterRefresh: any }>();

const captchaData = ref<Recordable<any>>({});

const imageSrc = computed(() => {
  return unref(captchaData).text?.image;
});

const refresh = async () => {
  captchaData.value = await props.api();
  emit('afterRefresh', unref(captchaData));
};

const createValidateParameter = (data: any) => {
  const { key, type } = unref(captchaData);

  return {
    key,
    text: {
      code: data,
    },
    type,
  };
};

const computedImgStyle = computed(() => {
  return {
    height: props.height,
  };
});

defineExpose({
  createValidateParameter,
  refresh,
});

refresh();
</script>

<template>
  <VbenTooltip>
    {{ t('authentication.refreshCode') }}
    <template #trigger>
      <img :src="imageSrc" :style="computedImgStyle" @click="refresh" />
    </template>
  </VbenTooltip>
</template>

<style scoped></style>
