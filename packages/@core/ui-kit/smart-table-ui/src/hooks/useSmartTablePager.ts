import type { VxeGridPropTypes } from 'vxe-table';

import type { ComputedRef } from 'vue';

import type { SmartTableRenderProps } from '../types';

import { computed, ref, unref } from 'vue';

import { isBoolean } from '@vben-core/shared/utils';

import {
  DEFAULT_PAGE_LAYOUTS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from '../const';

const useSmartTablePagerConfig = (
  tableProps: ComputedRef<SmartTableRenderProps>,
) => {
  const innerPagerConfig = ref<VxeGridPropTypes.PagerConfig>({});

  /**
   * 分页配置计算属性
   */
  const computedPagerConfig = computed(() => {
    const { pagerConfig } = unref(tableProps);
    if (!pagerConfig) {
      return undefined;
    }
    if (isBoolean(pagerConfig) && !pagerConfig) {
      return undefined;
    }
    return {
      currentPage: 1,
      layouts: DEFAULT_PAGE_LAYOUTS,
      pageSize: DEFAULT_PAGE_SIZE,
      pageSizes: DEFAULT_PAGE_SIZE_OPTIONS,
      ...(isBoolean(pagerConfig) ? {} : pagerConfig),
      ...unref(innerPagerConfig),
    };
  });

  const setPagerConfig = (info: Partial<VxeGridPropTypes.PagerConfig>) => {
    innerPagerConfig.value = {
      ...unref(innerPagerConfig),
      ...info,
    };
  };

  return {
    computedPagerConfig,
    setPagerConfig,
  };
};

export { useSmartTablePagerConfig };
