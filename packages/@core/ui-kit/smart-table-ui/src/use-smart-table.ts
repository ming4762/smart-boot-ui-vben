import type { ExtendSmartTableApi, SmartTableProps } from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useStore } from '@vben-core/shared/store';

import { SmartTableApi } from './smart-table-api';
import SmartUseTable from './smart-use-table.vue';
import { hasPermission } from './utils';

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
      // 设置默认的auth handler
      const authConfig = {
        authHandler: hasPermission,
        ...props.authConfig,
      };
      return () =>
        h(
          SmartUseTable,
          { ...props, ...attrs, api: extendedApi, authConfig, hasPermission },
          slots,
        );
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
  return [SmartTable, extendedApi] as const;
}

export { useSmartTable };
