import type { SmartTableRenderProps } from '../types';

import { computed, type ComputedRef, ref, unref, watch } from 'vue';

/**
 * 表格加载状态
 * @param tableProps
 */
export const useSmartTableLoading = (
  tableProps: ComputedRef<SmartTableRenderProps>,
) => {
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
