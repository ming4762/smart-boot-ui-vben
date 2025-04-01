/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

import type { Component } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { defineComponent, getCurrentInstance, h, ref } from 'vue';

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
  Rate,
  Select,
  Space,
  Switch,
  Tag,
  Textarea,
  Tooltip,
  TreeSelect,
  Upload,
} from 'ant-design-vue';

import {
  ApiDictSelect,
  SmartDropdown,
  SmartIconButton,
  SmartTableSelectUser,
  ZonedDatePicker,
  ZonedRangePicker,
  ZonedTimePicker,
} from '#/components';
import {
  createConfirm,
  errorMessage,
  successMessage,
  warnMessage,
} from '#/utils';

import { doSetupVbenForm } from '../form';
import { doSetupSmartTable } from '../smart-table';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    inheritAttrs: false,
    name: component.name,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder || attrs?.placeholder || t(`ui.placeholder.${type}`);
      // 透传组件暴露的方法
      const innerRef = ref();
      const publicApi: Recordable<any> = {};
      expose(publicApi);
      const instance = getCurrentInstance();
      instance?.proxy?.$nextTick(() => {
        for (const key in innerRef.value) {
          if (typeof innerRef.value[key] === 'function') {
            publicApi[key] = innerRef.value[key];
          }
        }
      });
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
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
    ApiSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      component: Select,
      loadingSlot: 'suffixIcon',
      visibleEvent: 'onDropdownVisibleChange',
      modelPropName: 'value',
    }),
    AInput: Input,
    ASelect: Select,
    ASwitch: Switch,
    Tag,
    Popconfirm,
    Dropdown: SmartDropdown,
    ApiTreeSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      component: TreeSelect,
      fieldNames: { label: 'label', value: 'value', children: 'children' },
      loadingSlot: 'suffixIcon',
      modelPropName: 'value',
      optionsPropName: 'treeData',
      visibleEvent: 'onVisibleChange',
    }),
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker: ZonedDatePicker,
    Menu,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
      iconSlot: 'addonAfter',
      inputComponent: Input,
      modelValueProp: 'value',
    }),
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
    RangePicker: ZonedRangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker: ZonedTimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
    ApiDictSelect: withDefaultPlaceholder(ApiDictSelect, 'select'),
    Cascader,
    SmartPulldownTable: withDefaultPlaceholder(SmartPulldownTable, 'select'),
    CodeEditor,
    Tooltip,
    SmartTableSelectUser,
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
