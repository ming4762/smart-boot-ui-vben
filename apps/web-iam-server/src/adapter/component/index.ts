import type { Component } from 'vue';

import type { Recordable } from '@vben/types';

import { defineAsyncComponent, defineComponent, h, ref } from 'vue';

import { globalShareState } from '@vben/common-ui';
import {$ct as t} from '@vben/locales';

const Textarea = defineAsyncComponent(
  () => import('antdv-next/dist/input/TextArea'),
);
const Button = defineAsyncComponent(
  () => import('antdv-next/dist/button/index'),
);

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder || attrs?.placeholder || t(`ui.placeholder.${type}`);
      // 透传组件暴露的方法
      const innerRef = ref();
      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => innerRef.value?.[key],
            has: (_target, key) => key in (innerRef.value || {}),
          },
        ),
      );
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
};

function initComponentAdapter() {
  const components: Partial<Record<string, Component>> = {
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
  };

  globalShareState.setComponents(components);

  globalShareState.defineMessage({
    copyPreferencesSuccess: (_title, _content) => {},
    success: () => {},
    error: () => {},
    warning: () => {},
    confirm: () => {},
  });
}

export { initComponentAdapter };
