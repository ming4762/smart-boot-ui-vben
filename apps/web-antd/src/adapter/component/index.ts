/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Component, SetupContext } from 'vue';

import { ApiDictSelect, SmartDropdown, SmartIconButton } from '#/components';
import {
  createConfirm,
  errorMessage,
  successMessage,
  warnMessage,
} from '#/utils';
import {
  ApiComponent,
  CodeEditor,
  globalShareState,
  IconPicker,
  SmartPulldownTable,
} from '@vben/common-ui';
import { $ct as t } from '@vben/locales';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  Menu,
  notification,
  Popconfirm,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Space,
  Switch,
  Tag,
  Textarea,
  TimePicker,
  Tooltip,
  TreeSelect,
  Upload,
} from 'ant-design-vue';
import { h } from 'vue';

import { doSetupVbenForm } from '../form';
import { doSetupSmartTable } from '../smart-table';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || t(`ui.placeholder.${type}`);
    return h(component, { ...props, ...attrs, placeholder }, slots);
  };
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'ApiDictSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'CodeEditor'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'Dropdown'
  | 'IconButton'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'Menu'
  | 'Popconfirm'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'SmartPulldownTable'
  | 'Space'
  | 'Switch'
  | 'Tag'
  | 'Textarea'
  | 'TimePicker'
  | 'Tooltip'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),
    ApiSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: Select,
          loadingSlot: 'suffixIcon',
          visibleEvent: 'onDropdownVisibleChange',
          modelPropName: 'value',
        },
        slots,
      );
    },
    AInput: Input,
    ASelect: Select,
    ASwitch: Switch,
    Tag,
    Popconfirm,
    Dropdown: SmartDropdown,
    ApiTreeSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: TreeSelect,
          fieldNames: { label: 'label', value: 'value', children: 'children' },
          loadingSlot: 'suffixIcon',
          modelPropName: 'value',
          optionsPropName: 'treeData',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Menu,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    IconPicker: (props, { attrs, slots }) => {
      return h(
        IconPicker,
        { iconSlot: 'addonAfter', inputComponent: Input, ...props, ...attrs },
        slots,
      );
    },
    IconButton: SmartIconButton,
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
    // IconPicker: withDefaultPlaceholder(IconPicker, 'select'),
    ApiDictSelect: withDefaultPlaceholder(ApiDictSelect, 'select'),
    // ApiSelect: withDefaultPlaceholder(ApiSelect, 'select'),
    Cascader,
    SmartPulldownTable: withDefaultPlaceholder(SmartPulldownTable, 'select'),
    CodeEditor,
    Tooltip,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
    confirm: createConfirm,
    success: successMessage,
    error: errorMessage,
    warning: warnMessage,
  });
  doSetupVbenForm();
  doSetupSmartTable();
}

export { initComponentAdapter };
