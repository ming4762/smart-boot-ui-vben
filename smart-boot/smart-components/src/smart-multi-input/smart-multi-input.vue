<script setup lang="ts">
import type { SmartMultiInputProps } from './types';

import { computed, ref, useAttrs, watch } from 'vue';

import { Button, Col, Input, Row, Space, SpaceCompact } from 'antdv-next';

import { DEFAULT_SPACE_PROPS } from './constants';

interface Props extends SmartMultiInputProps {}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
});
const emit = defineEmits(['update:value', 'update:modelValue', 'change']);

const attrs = useAttrs();

const computedSpaceProps = computed(() => {
  return {
    ...DEFAULT_SPACE_PROPS,
    ...props.spaceProps,
  };
});

const inner = ref<string[]>(['']);
watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val)) {
      inner.value = val.length > 0 ? val : [''];
    } else {
      inner.value = [''];
    }
  },
  { immediate: true },
);
const values = computed<string[]>({
  get() {
    return inner.value;
  },
  set(val) {
    inner.value = val;
    let emitValue: null | string[] = val;
    if (val.length === 1 && val[0] === '') {
      emitValue = null;
    }
    emit('update:value', emitValue);
    emit('update:modelValue', emitValue);
    // emit('change', emitValue);
  },
});

/**
 * input组件属性
 */
const computedInputAttrs = computed<any>(() => {
  const { size, disabled, allowClear } = props;
  return {
    size,
    disabled,
    allowClear,
  };
});

const computedSpaceCompactAttrs = computed<any>(() => {
  const { size } = props;
  return {
    size,
  };
});

const updateValues = (updater: (list: string[]) => string[]) => {
  values.value = updater([...values.value]);
};

/**
 * 溢出指定行
 * @param index
 */
const handleRemoveRow = (index: number) => {
  updateValues((list) => {
    if (list.length === 1) {
      list[0] = '';
    } else {
      list.splice(index, 1);
    }
    return list;
  });
};

const handleAddRow = () => {
  updateValues((list) => [...list, '']);
};

const handleInputChange = (index: number, val: string) => {
  const next = [...values.value];
  next[index] = val;
  values.value = next;
};
</script>

<template>
  <div class="smart-multi-input w-full" v-bind="attrs">
    <Space orientation="vertical" v-bind="computedSpaceProps">
      <Row v-for="(_item, index) in values" :key="index">
        <Col :span="24">
          <SpaceCompact v-bind="computedSpaceCompactAttrs" block>
            <Input
              :value="values[index]"
              @update:value="(val) => handleInputChange(index, val)"
              v-bind="computedInputAttrs"
            />
            <Button
              @click="() => handleRemoveRow(index)"
              color="danger"
              variant="filled"
            >
              删除
            </Button>
          </SpaceCompact>
        </Col>
      </Row>
      <Button
        @click="handleAddRow"
        :size="props.size as never"
        color="primary"
        variant="filled"
      >
        添加
      </Button>
    </Space>
  </div>
</template>

<style lang="less">
.smart-multi-input {
  .ant-space {
    width: 100%;
  }
}
</style>
