<script setup lang="tsx">
import type { SmartFormItemProps } from '../types';

import { toRefs, unref } from 'vue';

import { isBoolean, isFunction } from '@vben-core/shared/utils';

import { Col, Divider, Form } from 'ant-design-vue';

import { useItemLabelWidth } from '../hooks/useLabelWidth';

interface Props extends SmartFormItemProps {}

defineOptions({
  name: 'BasicFormItem',
});

const props = withDefaults(defineProps<Props>(), {
  allDefaultValues: {},
  formModel: {},
  formProps: {},
  schema: {},
});

const { formProps, schema } = toRefs(props);

// 组件 CropperAvatar 的 size 属性类型为 number
// 此处补充一个兼容
if (
  unref(schema).component === 'CropperAvatar' &&
  typeof unref(formProps).size === 'string'
) {
  formProps.value.size = undefined;
}

const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

const getValues = computed(() => {
  const { allDefaultValues, formModel, schema } = props;
  const { mergeDynamicData } = props.formProps;
  return {
    field: schema.field,
    model: formModel,
    schema,
    values: {
      ...mergeDynamicData,
      ...allDefaultValues,
      ...formModel,
    } as Record<string, any>,
  };
});

const getComponentsProps = computed(() => {
  const { formActionType, formModel, schema, tableAction } = props;
  let { componentProps = {} } = schema;
  if (isFunction(componentProps)) {
    componentProps =
      componentProps({ formActionType, formModel, schema, tableAction }) ?? {};
  }
  if (isIncludeSimpleComponents(schema.component)) {
    componentProps = Object.assign(
      { type: 'horizontal' },
      {
        orientation: 'left',
        plain: true,
      },
      componentProps,
    );
  }
  return componentProps as Recordable<any>;
});

const getDisable = computed(() => {
  const { disabled: globDisabled } = props.formProps;
  const { dynamicDisabled } = props.schema;
  const { disabled: itemDisabled = false } = unref(getComponentsProps);
  let disabled = !!globDisabled || itemDisabled;
  if (isBoolean(dynamicDisabled)) {
    disabled = dynamicDisabled;
  }
  if (isFunction(dynamicDisabled)) {
    disabled = dynamicDisabled(unref(getValues));
  }
  return disabled;
});

const getReadonly = computed(() => {
  const { readonly: globReadonly } = props.formProps;
  const { dynamicReadonly } = props.schema;
  const { readonly: itemReadonly = false } = unref(getComponentsProps);

  let readonly = globReadonly || itemReadonly;
  if (isBoolean(dynamicReadonly)) {
    readonly = dynamicReadonly;
  }
  if (isFunction(dynamicReadonly)) {
    readonly = dynamicReadonly(unref(getValues));
  }
  return readonly;
});

const getIsAdvanced = (isAdvanced: any) => {
  return isBoolean(isAdvanced) ? isAdvanced : true;
};

function getShow(): { isIfShow: boolean; isShow: boolean } {
  const { ifShow, show } = props.schema;
  const { showAdvancedButton } = props.formProps;
  const itemIsAdvanced = showAdvancedButton
    ? getIsAdvanced(props.isAdvanced)
    : true;

  let isShow = true;
  let isIfShow = true;

  if (isBoolean(show)) {
    isShow = show;
  }
  if (isBoolean(ifShow)) {
    isIfShow = ifShow;
  }
  if (isFunction(show)) {
    isShow = show(unref(getValues));
  }
  if (isFunction(ifShow)) {
    isIfShow = ifShow(unref(getValues));
  }
  isShow = isShow && itemIsAdvanced;
  return { isIfShow, isShow };
}

function handleRules(): ValidationRule[] {
  const {
    component,
    dynamicRules,
    label,
    required,
    rules: defRules = [],
    rulesMessageJoinLabel,
  } = props.schema;
  if (isFunction(dynamicRules)) {
    return dynamicRules(unref(getValues)) as ValidationRule[];
  }

  let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[];
  const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } =
    props.formProps;

  const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
    ? rulesMessageJoinLabel
    : globalRulesMessageJoinLabel;
  const assertLabel = joinLabel ? (isFunction(label) ? '' : label) : '';
  const defaultMsg = component
    ? createPlaceholderMessage(component) + assertLabel
    : assertLabel;

  function validator(rule: any, value: any) {
    const msg = rule.message || defaultMsg;
    if (value === undefined || isNull(value)) {
      // 空值
      return Promise.reject(msg);
    } else if (Array.isArray(value) && value.length === 0) {
      // 数组类型
      return Promise.reject(msg);
    } else if (typeof value === 'string' && value.trim() === '') {
      // 空字符串
      return Promise.reject(msg);
    } else if (
      typeof value === 'object' &&
      Reflect.has(value, 'checked') &&
      Reflect.has(value, 'halfChecked') &&
      Array.isArray(value.checked) &&
      Array.isArray(value.halfChecked) &&
      value.checked.length === 0 &&
      value.halfChecked.length === 0
    ) {
      // 非关联选择的tree组件
      return Promise.reject(msg);
    }
    return Promise.resolve();
  }
  const getRequired = isFunction(required)
    ? required(unref(getValues))
    : required;

  /*
   * 1、若设置了required属性，又没有其他的rules，就创建一个验证规则；
   * 2、若设置了required属性，又存在其他的rules，则只rules中不存在required属性时，才添加验证required的规则
   *     也就是说rules中的required，优先级大于required
   */
  if (getRequired) {
    if (!rules || rules.length === 0) {
      const trigger = NO_AUTO_LINK_COMPONENTS.includes(component || 'Input')
        ? 'blur'
        : 'change';
      rules = [{ required: getRequired, trigger, validator }];
    } else {
      const requiredIndex: number = rules.findIndex((rule) =>
        Reflect.has(rule, 'required'),
      );

      if (requiredIndex === -1) {
        rules.push({ required: getRequired, validator });
      }
    }
  }

  const requiredRuleIndex: number = rules.findIndex(
    (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
  );

  if (requiredRuleIndex !== -1) {
    const rule = rules[requiredRuleIndex];
    const { isShow } = getShow();
    if (!isShow) {
      rule.required = false;
    }
    if (component) {
      rule.message = rule.message || defaultMsg;

      if (component.includes('Input') || component.includes('Textarea')) {
        rule.whitespace = true;
      }
      const valueFormat = unref(getComponentsProps)?.valueFormat;
      setComponentRuleType(rule, component, valueFormat);
    }
  }

  // Maximum input length rule check
  const characterInx = rules.findIndex((val) => val.max);
  if (characterInx !== -1 && !rules[characterInx].validator) {
    rules[characterInx].message =
      rules[characterInx].message ||
      t('component.form.maxTip', [rules[characterInx].max] as Recordable<any>);
  }
  return rules;
}

function renderComponent() {
  if (!isComponentFormSchema(props.schema)) {
    return null;
  }
  const {
    changeEvent = 'change',
    component,
    field,
    renderComponentContent,
    valueField,
    valueFormat,
  } = props.schema;

  const isCheck = component && ['Checkbox', 'Switch'].includes(component);

  const eventKey = `on${upperFirst(changeEvent)}`;

  const { autoSetPlaceHolder, size } = props.formProps;

  const propsData: Recordable<any> = {
    allowClear: true,
    size,
    ...unref(getComponentsProps),
    disabled: unref(getDisable),
    readonly: unref(getReadonly),
  };

  const on = {
    [eventKey]: (...args: Nullable<Recordable<any>>[]) => {
      const [e] = args;

      const target = e ? e.target : null;
      let value = target ? (isCheck ? target.checked : target.value) : e;
      if (isFunction(valueFormat)) {
        value = valueFormat({ ...unref(getValues), value });
      }
      props.setFormModel(field, value, props.schema);

      if (propsData[eventKey]) {
        propsData[eventKey](...args);
      }
    },
  };
  const Comp = componentMap.get(component) as ReturnType<
    typeof defineComponent
  >;

  const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
  // RangePicker place is an array
  if (isCreatePlaceholder && component !== 'RangePicker' && component) {
    propsData.placeholder =
      unref(getComponentsProps)?.placeholder ||
      createPlaceholderMessage(component);
  }
  propsData.codeField = field;
  propsData.formValues = unref(getValues);

  const bindValue: Recordable<any> = {
    [valueField || (isCheck ? 'checked' : 'value')]: props.formModel[field],
  };

  const compAttr: Recordable<any> = {
    ...propsData,
    ...on,
    ...bindValue,
  };

  if (!renderComponentContent) {
    return <Comp {...compAttr} />;
  }
  const compSlot = isFunction(renderComponentContent)
    ? {
        ...renderComponentContent(unref(getValues), {
          disabled: unref(getDisable),
          readonly: unref(getReadonly),
        }),
      }
    : {
        default: () => renderComponentContent,
      };
  return <Comp {...compAttr}>{compSlot}</Comp>;
}

function renderLabelHelpMessage() {
  const { helpComponentProps, helpMessage, label, subLabel } = props.schema;
  const getLabel = isFunction(label) ? label(unref(getValues)) : label;
  const renderLabel = subLabel ? (
    <span>
      {getLabel} <span class="text-secondary">{subLabel}</span>
    </span>
  ) : (
    getLabel
  );
  const getHelpMessage = isFunction(helpMessage)
    ? helpMessage(unref(getValues))
    : helpMessage;
  if (
    !getHelpMessage ||
    (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)
  ) {
    return renderLabel;
  }
  return (
    <span>
      {renderLabel}
      <BasicHelp
        class="mx-1"
        placement="top"
        text={getHelpMessage}
        {...helpComponentProps}
      />
    </span>
  );
}

const doRender = (render: any, opts: any) => {
  return render ? render(unref(getValues), opts) : renderComponent();
};

function renderItem() {
  const { component, field, itemProps, prefix, render, slot, suffix } =
    props.schema;
  const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
  const { colon } = props.formProps;
  const opts = { disabled: unref(getDisable), readonly: unref(getReadonly) };
  if (component === 'Divider') {
    return (
      <Col span={24}>
        <Divider {...unref(getComponentsProps)}>
          {renderLabelHelpMessage()}
        </Divider>
      </Col>
    );
  } else if (component === 'BasicTitle') {
    return (
      <Form.Item
        class={{
          'prefix-item': !!prefix,
          'suffix-item': !!suffix,
        }}
        labelCol={labelCol}
        name={field}
        wrapperCol={wrapperCol}
      >
        <BasicTitle {...unref(getComponentsProps)}>
          {renderLabelHelpMessage()}
        </BasicTitle>
      </Form.Item>
    );
  } else {
    const getContent = () => {
      return slot
        ? getSlot(slots, slot, unref(getValues), opts)
        : doRender(render, opts);
    };

    const showSuffix = !!suffix;
    const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix;

    const showPrefix = !!prefix;
    const getPrefix = isFunction(prefix) ? prefix(unref(getValues)) : prefix;
    // TODO 自定义组件验证会出现问题，因此这里框架默认将自定义组件设置手动触发验证，如果其他组件还有此问题请手动设置autoLink=false
    if (component && NO_AUTO_LINK_COMPONENTS.includes(component)) {
      props.schema &&
        (props.schema.itemProps! = {
          autoLink: false,
          ...props.schema.itemProps,
        });
    }

    return (
      <Form.Item
        class={{
          'prefix-item': showPrefix,
          'suffix-item': showSuffix,
        }}
        colon={colon}
        name={field}
        {...(itemProps as Recordable<any>)}
        label={renderLabelHelpMessage()}
        labelCol={labelCol}
        rules={handleRules()}
        wrapperCol={wrapperCol}
      >
        <div style="display:flex">
          {showPrefix && <span class="prefix">{getPrefix}</span>}
          <div style="flex:1;">{getContent()}</div>
          {showSuffix && <span class="suffix">{getSuffix}</span>}
        </div>
      </Form.Item>
    );
  }
}

const doRenderColContent = (renderColContent: any, opts: any) => {
  return renderColContent ? renderColContent(values, opts) : renderItem();
};

const RenderFunction = () => {
  const {
    colProps = {},
    colSlot,
    component,
    renderColContent,
    slot,
  } = props.schema;
  if (!((component && componentMap.has(component)) || slot)) {
    return null;
  }

  const { baseColProps = {} } = props.formProps;
  const realColProps = { ...baseColProps, ...colProps };
  const { isIfShow, isShow } = getShow();
  const values = unref(getValues);
  const opts = { disabled: unref(getDisable), readonly: unref(getReadonly) };

  const getContent = () => {
    return colSlot
      ? getSlot(slots, colSlot, values, opts)
      : doRenderColContent(renderColContent, opts);
  };

  return (
    isIfShow && (
      <Col {...realColProps} v-show={isShow}>
        {getContent()}
      </Col>
    )
  );
};
</script>

<template>
  <RenderFunction />
</template>

<style scoped></style>
