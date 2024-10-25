<script setup lang="ts">
import type { ButtonProps } from 'ant-design-vue';

import type { BasicFormActionListeners, BasicFormActionProps } from '../types';

import { Button, Col, Form } from 'ant-design-vue';

import { useFormContext } from '../hooks/useFormContext';

interface Props extends BasicFormActionProps {}

defineOptions({ name: 'BasicFormAction' });

const props = withDefaults(defineProps<Props>(), {
  actionColOptions: {},
  actionSpan: 6,
  resetButtonOptions: {},
  showActionButtonGroup: true,
  showAdvancedButton: true,
  showResetButton: true,
  showSubmitButton: true,
  submitButtonOptions: {},
});

const emit = defineEmits<BasicFormActionListeners>();

const { resetAction, submitAction } = useFormContext();

const actionColOpt = computed(() => {
  const { actionColOptions, actionSpan: span, showAdvancedButton } = props;
  const actionSpan = 24 - span;
  const advancedSpanObj = showAdvancedButton
    ? { span: actionSpan < 6 ? 24 : actionSpan }
    : {};
  const actionColOpt: Partial<ColEx> = {
    span: showAdvancedButton ? 6 : 4,
    style: { textAlign: 'right' },
    ...advancedSpanObj,
    ...actionColOptions,
  };
  return actionColOpt;
});

const getResetBtnOptions = computed((): ButtonProps => {
  return Object.assign(
    {
      text: t('common.resetText'),
    },
    props.resetButtonOptions,
  );
});

const getSubmitBtnOptions = computed((): ButtonProps => {
  return Object.assign(
    {
      text: t('common.queryText'),
    },
    props.submitButtonOptions,
  );
});

const toggleAdvanced = () => {
  emit('toggleAdvanced');
};
</script>

<template>
  <Col v-bind="actionColOpt" v-if="showActionButtonGroup">
    <div
      :style="{ textAlign: actionColOpt.style.textAlign }"
      style="width: 100%"
    >
      <Form.Item>
        <slot name="resetBefore"></slot>
        <Button
          class="mr-2"
          v-bind="getResetBtnOptions"
          v-if="showResetButton"
          @click="resetAction"
        >
          {{ getResetBtnOptions.text }}
        </Button>
        <slot name="submitBefore"></slot>

        <Button
          class="mr-2"
          type="primary"
          v-bind="getSubmitBtnOptions"
          v-if="showSubmitButton"
          @click="submitAction"
        >
          {{ getSubmitBtnOptions.text }}
        </Button>
        <slot name="advanceBefore"></slot>

        <Button
          v-if="showAdvancedButton && !hideAdvanceBtn"
          size="small"
          type="link"
          @click="toggleAdvanced"
        >
          {{
            isAdvanced
              ? t('component.form.putAway')
              : t('component.form.unfold')
          }}
          <BasicArrow :expand="!isAdvanced" class="ml-1" up />
        </Button>
        <slot name="advanceAfter"></slot>
      </Form.Item>
    </div>
  </Col>
</template>

<style scoped></style>
