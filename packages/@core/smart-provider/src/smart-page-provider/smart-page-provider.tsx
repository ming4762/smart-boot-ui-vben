import type { PropType } from 'vue';

import { defineComponent } from 'vue';

import { useProviderDict } from './useProviderDict';

const SmartPageProvider = defineComponent({
  name: 'SmartPageProvider',
  props: {
    api: {
      required: true,
      type: Function as PropType<(args: any) => Promise<any>>,
    },
  },
  setup(props, { attrs, slots }) {
    useProviderDict(props.api);

    return () => {
      const children = slots.default?.(attrs);
      return children && children[0];
    };
  },
});

export { SmartPageProvider };
