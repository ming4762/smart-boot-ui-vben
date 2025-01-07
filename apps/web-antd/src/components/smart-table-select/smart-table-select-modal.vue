<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { SmartTableSelectModalProps } from '../type';

import { computed, unref, useSlots, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useSmartTableSelect } from './hooks/useSmartTableSelect';

interface Props extends SmartTableSelectModalProps {}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  showSelect: false,
  selectValues: () => [],
  alwaysLoad: false,
});

const emit = defineEmits<{
  optionChange: [Recordable<any>];
  selectData: [Recordable<any>, any[]];
}>();

const slots = useSlots();

const hasTableSlot = computed<boolean>(() => {
  return slots.table !== undefined;
});

const {
  computedTableSlotBindValues,
  RenderTable,
  RenderSelectTable,
  getHasSearchForm,
  selectRowsRef,
  handleModalOk,
} = useSmartTableSelect(props, hasTableSlot);

const getSelectOptions = (): Recordable<any> => {
  return unref(selectRowsRef).map((item) => {
    return {
      label: item[props.labelField],
      value: item[props.valueField],
    };
  });
};

const emitSelectData = () => {
  const selectOptions = getSelectOptions();
  emit('optionChange', selectOptions);
  emit('selectData', selectOptions, unref(selectRowsRef));
};

watch(selectRowsRef, () => {
  const selectOptions = getSelectOptions();
  emit('optionChange', selectOptions);
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onConfirm: () => {
    handleModalOk();
    modalApi.close();
    emitSelectData();
  },
});

const computedSelectContainerClass = computed(() => {
  if (unref(getHasSearchForm)) {
    return ['mt-[49px]'];
  }
  return [];
});
</script>

<template>
  <Modal v-bind="$attrs">
    <template v-if="hasTableSlot">
      <slot name="table" v-bind="computedTableSlotBindValues"></slot>
    </template>
    <div v-else class="flex flex-nowrap" style="height: 600px">
      <div :class="showSelect ? 'w-1/2' : 'w-full'" class="h-full">
        <RenderTable />
      </div>
      <div
        v-if="showSelect"
        :class="computedSelectContainerClass"
        class="w-1/2"
      >
        <RenderSelectTable />
      </div>
    </div>
  </Modal>
</template>

<style lang="less" scoped></style>
