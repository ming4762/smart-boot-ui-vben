import type { ExtendSmartTableApi, SmartTableProps } from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useStore } from '@vben-core/shared/store';

import { SmartTableApi } from './smart-table-api';
import SmartUseTable from './smart-use-table.vue';

function useSmartTable(options: SmartTableProps) {
  // 参数是否具有响应性
  const IS_REACTIVE = isReactive(options);

  const api = new SmartTableApi(options);
  const extendedApi: ExtendSmartTableApi = api as never;

  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const SmartTable = defineComponent(
    (props: SmartTableProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmounted();
      });
      return () =>
        h(SmartUseTable, { ...props, ...attrs, api: extendedApi }, slots);
    },
    {
      inheritAttrs: false,
      name: 'SmartUseTable',
    },
  );
  if (IS_REACTIVE) {
    watch(
      () => options.columns,
      () => api.setState({ columns: options.columns }),
      { immediate: true },
    );
  }
  return [SmartTable, extendedApi];
}

export { useSmartTable };
