import type { FormProps as AntFormProps, RowProps } from 'ant-design-vue';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
// import type { FormProps as AntFormProps } from 'ant-design-vue/es/form/Form';

import type { CSSProperties } from 'vue';

interface BaseFormSchema<T extends ComponentType = any> {
  // Event name triggered by internal value change, default change
  changeEvent?: string;
  // col configuration outside formModelItem
  colProps?: Partial<ColEx>;
  // Custom slot, similar to renderColContent
  colSlot?: string;
  // Component parameters
  componentProps?:
    | ((opt: {
        formActionType: FormActionType;
        formModel: Recordable;
        // eslint-disable-next-line no-use-before-define
        schema: SmartFormSchema;
        tableAction: TableActionType;
      }) => ComponentProps[T])
    | ComponentProps[T];
  // 默认值
  defaultValue?: any;
  // 额外默认值数组对象
  defaultValueObj?: { [key: string]: any };
  // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
  disabledLabelWidth?: boolean;
  dynamicDisabled?:
    | ((renderCallbackParams: RenderCallbackParams) => boolean)
    | boolean;
  dynamicReadonly?:
    | ((renderCallbackParams: RenderCallbackParams) => boolean)
    | boolean;
  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
  // Field name
  field: string;
  // Extra Fields name[]
  fields?: string[];

  // BaseHelp component props
  helpComponentProps?: Partial<HelpComponentProps>;
  // Help text on the right side of the text
  helpMessage?:
    | ((renderCallbackParams: RenderCallbackParams) => string | string[])
    | string
    | string[];
  ifShow?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;
  isAdvanced?: boolean;

  // 是否自动处理与时间相关组件的默认值
  isHandleDateDefaultValue?: boolean;

  // 是否使用valueFormat自动处理默认值
  isHandleDefaultValue?: boolean;

  // Reference formModelItem
  itemProps?: Partial<FormItem>;

  // Label name
  label?:
    | ((renderCallbackParams: RenderCallbackParams) => string | VNode)
    | string
    | VNode;

  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: number | string;

  prefix?:
    | ((renderCallbackParams: RenderCallbackParams) => number | string | VNode)
    | number
    | string
    | VNode;

  // Render the content in the form-item tag
  render?: (
    renderCallbackParams: RenderCallbackParams,
    opts: RenderOpts,
  ) => string | VNode | VNode[];

  // Rendering col content requires outer wrapper form-item
  renderColContent?: (
    renderCallbackParams: RenderCallbackParams,
    opts: RenderOpts,
  ) => string | VNode | VNode[];

  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams, opts: RenderOpts) => any)
    | string
    | VNode
    | VNode[];

  // Required
  required?:
    | ((renderCallbackParams: RenderCallbackParams) => boolean)
    | boolean;

  // Validation rules
  rules?: Rule[];

  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;

  show?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;

  // Matching details components
  span?: number;

  // Auxiliary text
  subLabel?: string;

  suffix?:
    | ((renderCallbackParams: RenderCallbackParams) => number | string | VNode)
    | number
    | string
    | VNode;

  // Variable name bound to v-model Default value
  valueField?: string;

  valueFormat?: (arg: { value: any } & Partial<RenderCallbackParams>) => any;
}

interface SmartSlotFormSchema extends BaseFormSchema {
  // Custom slot, in form-item
  slot: string;
}

type ComponentFormSchemaType<T extends ComponentType = ComponentType> =
  T extends any ? ComponentFormSchema<T> : never;

type SmartFormSchema = ComponentFormSchemaType | SlotFormSchema;

/**
 * 表单渲染 props
 */
interface SmartFormRenderProps extends AntFormProps {
  // 是否按下回车键自动提交
  autoSubmitOnEnter?: boolean;
  // General row style
  baseRowStyle?: CSSProperties;
  resetFunc?: () => Promise<void>;
  // Row configuration for the entire form
  rowProps?: RowProps;
  schemas?: SmartFormSchema[];
  submitFunc?: () => Promise<void>;
}

type FormSchemaInner = BaseFormSchema &
  Partial<ComponentFormSchema> &
  Partial<SlotFormSchema>;

interface SmartFormActionType {
  appendSchemaByField: (
    schema: FormSchemaInner | FormSchemaInner[],
    prefixField: string | undefined,
    first?: boolean | undefined,
  ) => Promise<void>;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: () => Recordable;
  removeSchemaByField: (field: string | string[]) => Promise<void>;
  resetDefaultField: (name?: NamePath[]) => void;
  resetFields: () => Promise<void>;
  resetSchema: (
    data: Partial<FormSchemaInner> | Partial<FormSchemaInner>[],
  ) => Promise<void>;
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
  setFieldsValue: (values: Recordable) => Promise<void>;
  setProps: (formProps: Partial<SmartFormRenderProps>) => Promise<void>;
  submit: () => Promise<void>;
  updateSchema: (
    data: Partial<FormSchemaInner> | Partial<FormSchemaInner>[],
  ) => Promise<void>;
  validate: <T = Record<string, any>>(
    nameList?: false | NamePath[],
  ) => Promise<T>;
  validateFields: (nameList?: NamePath[]) => Promise<any>;
}

/**
 * 表单事件
 */
interface SmartFormListener {
  advancedChange: (isAdvanced: boolean) => void;
  fieldValueChange: (key: string, value: any) => void;
  reset: (formModel: Record<string, any>) => void;
  submit: (values: any) => void;
}

export {
  SmartFormActionType,
  SmartFormListener,
  SmartFormRenderProps,
  SmartFormSchema,
  SmartSlotFormSchema,
};
