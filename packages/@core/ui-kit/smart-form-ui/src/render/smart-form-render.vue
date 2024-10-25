<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';

import type {
  SmartFormListener,
  SmartFormRenderProps,
  SmartFormSchema,
} from '../types';
import type { AdvanceState } from '../types/hooks';

import { computed, unref, useTemplateRef } from 'vue';

import { useSmartAppContext } from '@vben-core/smart-app-provider';

import { Form, Row } from 'ant-design-vue';

import FormAction from '../components/BasicFormAction.vue';
import FormItem from '../components/FormItem.vue';
import { useAdvanced } from '../hooks/useAdvanced';
import { useFormEvents } from '../hooks/useFormEvents';

interface Props extends SmartFormRenderProps {}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<SmartFormListener>();

const formElRef = useTemplateRef<FormInstance>('formElRef');
const schemaRef = ref<null | SmartFormSchema[]>(null);

const formModel = reactive({});

const defaultValueRef = ref({});
const advanceState = reactive<AdvanceState>({
  actionSpan: 6,
  hideAdvanceBtn: false,
  isAdvanced: true,
  isLoad: false,
});

const doGetValueFormat = (componentProps: any, opt: any) => {
  return typeof componentProps === 'function'
    ? componentProps(opt).valueFormat
    : componentProps.valueFormat;
};

const getSchema = computed(() => {
  const schemas: SmartFormSchema[] = cloneDeep(
    unref(schemaRef) || (props.schemas as any),
  );
  for (const schema of schemas) {
    const {
      component,
      componentProps = {},
      defaultValue,
      field,
      isHandleDateDefaultValue = true,
      isHandleDefaultValue = true,
      valueFormat,
    } = schema;
    // handle date type
    if (
      isHandleDateDefaultValue &&
      defaultValue &&
      component &&
      dateItemType.includes(component)
    ) {
      const opt = {
        formActionType: {} as FormActionType,
        formModel,
        schema,
        tableAction: props.tableAction ?? ({} as TableActionType),
      };
      const valueFormat = componentProps
        ? doGetValueFormat(componentProps, opt)
        : null;
      if (Array.isArray(defaultValue)) {
        const def: any[] = [];
        defaultValue.forEach((item) => {
          def.push(
            valueFormat ? dateUtil(item).format(valueFormat) : dateUtil(item),
          );
        });
        schema.defaultValue = def;
      } else {
        schema.defaultValue = valueFormat
          ? dateUtil(defaultValue).format(valueFormat)
          : dateUtil(defaultValue);
      }
    }
    // handle upload type
    if (defaultValue && itemIsUploadComponent(schema?.component)) {
      if (isArray(defaultValue)) {
        schema.defaultValue = defaultValue;
      } else if (typeof defaultValue === 'string') {
        schema.defaultValue = [defaultValue];
      }
    }

    // handle schema.valueFormat
    if (
      isHandleDefaultValue &&
      defaultValue &&
      component &&
      isFunction(valueFormat)
    ) {
      schema.defaultValue = valueFormat({
        field,
        model: formModel,
        schema,
        value: defaultValue,
      });
    }
  }
  return unref(getProps).showAdvancedButton
    ? (schemas.filter(
        (schema) => !isIncludeSimpleComponents(schema.component),
      ) as SmartFormSchema[])
    : (schemas as SmartFormSchema[]);
});

const { handleSubmit } = useFormEvents({
  defaultValueRef,
  emit,
  formElRef: formElRef as Ref<FormActionType>,
  formModel,
  getSchema,
  handleFormValues,
  props,
  schemaRef: schemaRef as Ref<FormSchema[]>,
});

/**
 * 获取form上下文
 */
const computedSmartAppForm = computed(() => {
  const { form } = useSmartAppContext();
  return unref(form || {});
});

/**
 * 是否回车提交
 */
const computedSubmitOnEnter = computed(() => {
  const autoSubmitOnEnter = props.autoSubmitOnEnter;
  if (autoSubmitOnEnter) {
    return true;
  }
  return unref(computedSmartAppForm).autoSubmitOnEnter;
});

const getRow = computed(() => {
  const { baseRowStyle = {}, rowProps } = props;
  return {
    style: baseRowStyle,
    ...rowProps,
  };
});

const { fieldsIsAdvancedMap, handleToggleAdvanced } = useAdvanced({
  advanceState,
  defaultValueRef,
  emit,
  formModel,
  getSchema,
  props,
});

/**
 * 表单回车事件
 * @param e
 */
const handleEnterPress = (e: KeyboardEvent) => {
  const autoSubmitOnEnter = unref(computedSubmitOnEnter);
  if (!autoSubmitOnEnter) {
    return;
  }
  if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
    const target: HTMLElement = e.target as HTMLElement;
    if (target && target.tagName && target.tagName.toUpperCase() === 'INPUT') {
      handleSubmit();
    }
  }
};

const getFormActionBindProps = computed(
  () =>
    ({ ...unref(props), ...advanceState }) as InstanceType<
      typeof FormAction
    >['$props'],
);

const formActionType = {
  appendSchemaByField,
  clearValidate,
  getFieldsValue,
  removeSchemaByField,
  resetDefaultField,
  resetFields,
  resetSchema,
  scrollToField,
  setFieldsValue,
  setProps,
  submit: handleSubmit,
  updateSchema,
  validate,
  validateFields,
};
</script>

<template>
  <Form
    v-bind="props"
    ref="formElRef"
    :model="formModel"
    @keyup.enter="handleEnterPress"
  >
    <Row v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :all-default-values="defaultValueRef"
          :form-action-type="formActionType"
          :form-model="formModel"
          :form-props="props"
          :is-advanced="fieldsIsAdvancedMap[schema.field]"
          :schema="schema"
          :set-form-model="setFormModel"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>

      <FormAction
        v-bind="getFormActionBindProps"
        @toggle-advanced="handleToggleAdvanced"
      >
        <template
          v-for="item in [
            'resetBefore',
            'submitBefore',
            'advanceBefore',
            'advanceAfter',
          ]"
          #[item]="data"
        >
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </FormAction>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>

<style scoped></style>
