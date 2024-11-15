import type { SmartTableRenderProps } from '../types';

import { computed, ref, unref, watch } from 'vue';

/**
 * 表格加载状态
 * @param tableProps
 */
export const useSmartTableLoading = (tableProps: SmartTableRenderProps) => {
  const loadingRef = ref(unref(tableProps).loading);

  watch(
    () => unref(tableProps).loading,
    (loading) => {
      loadingRef.value = loading;
    },
  );

  const getLoading = computed(() => unref(loadingRef));

  const setLoading = (loading: boolean) => {
    loadingRef.value = loading;
  };

  return { getLoading, setLoading };
};
