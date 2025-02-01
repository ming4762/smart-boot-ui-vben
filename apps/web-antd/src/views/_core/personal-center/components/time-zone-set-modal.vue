<script setup lang="ts">
import type { RadioChangeEvent } from 'ant-design-vue';

import { reactive, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { Radio } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useUserProfileStore } from '#/store';

const RadioGroup = Radio.Group;

const userProfileStore = useUserProfileStore();

const { timeZone, timeZoneOptions } = storeToRefs(userProfileStore);

const currentTimeZone = ref<string>('');

const [Modal, modalApi] = useVbenModal({
  title: t('ui.widgets.personalCenter.systemSetting.timeZoneSetting'),
  draggable: true,
  onOpened: () => {
    currentTimeZone.value = unref(timeZone);
  },
  onConfirm: () => {
    if (unref(currentTimeZone) !== unref(timeZone)) {
      userProfileStore.setTimeZone(unref(currentTimeZone));
    }
    modalApi.close();
  },
});

const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});

const handleChange = (e: RadioChangeEvent) => {
  currentTimeZone.value = e.target.value;
};
</script>

<template>
  <Modal>
    <div class="container">
      <RadioGroup @change="handleChange" :value="currentTimeZone">
        <Radio
          :style="radioStyle"
          v-for="item in timeZoneOptions"
          :key="item.timeZone"
          :value="item.timeZone"
        >
          {{ `${item.timeZone}` }}
        </Radio>
      </RadioGroup>
    </div>
  </Modal>
</template>

<style scoped>
.container {
  padding-left: 20px;
}
</style>
