<script setup lang="ts">
import type { SmartTableSelectProps } from '../type';

import { computed, ref, useSlots } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { Select } from 'ant-design-vue';

import { SmartIconButton } from '#/components';

import SmartTableSelectModal from './smart-table-select-modal.vue';

interface Props extends SmartTableSelectProps {}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  disabled: false,
});

const emit = defineEmits<{ change: [any]; 'update:value': [any] }>();

const slots = useSlots();

const optionsRef = ref<Array<any>>([]);
const handleOptionChange = (options: any[]) => {
  optionsRef.value = options;
};

const handleEmit = (data?: any[]) => {
  let value: any | undefined;
  if (data && data.length > 0) {
    value = data;
  }
  if (value && !props.multiple) {
    value = value[0];
  }
  emit('update:value', value);
  emit('change', value);
};

const handleDeselect = (value: any) => {
  const multiple = props.multiple;
  if (multiple) {
    const data = (props.value as any[]).filter((item) => item !== value);
    handleEmit(data);
  } else {
    handleEmit();
  }
};

const handleSelectData = (options: any[]) => {
  handleEmit(options.map((item) => item.value));
};

const [Modal, modalApi] = useVbenModal({
  connectedComponent: SmartTableSelectModal,
  draggable: true,
});

const computedSelectValue = computed(() => {
  const value = props.value;
  return value ? (props.multiple ? value : [value]) : value;
});

const handleOpen = () => {
  modalApi.setData(props.value || {});
  modalApi.open();
};

const hasTableSlot = computed<boolean>(() => {
  return slots.table !== undefined;
});
</script>

<template>
  <div class="smart-table-select w-full">
    <div class="flex">
      <div class="select">
        <Select
          v-bind="$attrs"
          :disabled="disabled"
          :mode="(multiple ? 'multiple' : 'combobox') as never"
          :open="false"
          :options="optionsRef"
          :size="size as never"
          :value="value"
          class="w-full"
          @deselect="handleDeselect"
        />
      </div>
      <div class="button">
        <SmartIconButton
          :disabled="disabled"
          :size="size as never"
          type="primary"
          @click="handleOpen"
        >
          {{ t('common.button.choose') }}
        </SmartIconButton>
      </div>
    </div>
    <Modal
      v-bind="$attrs"
      :label-field="labelField"
      :multiple="multiple"
      :select-values="computedSelectValue"
      :table-props="tableProps"
      :value-field="valueField"
      @option-change="handleOptionChange"
      @select-data="handleSelectData"
    >
      <template v-if="hasTableSlot" #table="slotProps">
        <slot name="table" v-bind="slotProps"></slot>
      </template>
    </Modal>
  </div>
</template>

<style lang="less">
.smart-table-select {
  @width: 80px;

  .select {
    width: calc(100% - @width - 8px);
    margin-right: 4px;
  }

  .button {
    margin-left: 4px;
    width: @width;
  }
}
</style>
