import type { SmartFormProps } from './types';

import { defineComponent, h } from 'vue';

import SmartUseForm from './smart-use-form.vue';

const useSmartForm = (options: SmartFormProps) => {
  console.error(options);
  const SmartForm = defineComponent(
    (props: SmartFormProps, { attrs, slots }) => {
      return () => h(SmartUseForm, { ...props, ...attrs }, slots);
    },
    {
      inheritAttrs: false,
      name: 'SmartUseTable',
    },
  );

  return [SmartForm];
};

export { useSmartForm };
