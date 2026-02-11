import type { ComputedRef } from 'vue';

import type { SmartTableRenderProps } from '../types/SmartTableCommonType';

import { computed, ref, unref, watch } from 'vue';

/**
 * 表格加载状态
 * @param tableProps
 */
export const useSmartTableLoading = (
  tableProps: ComputedRef<SmartTableRenderProps>,
) => {
  const loadingRef = ref<boolean>(unref(tableProps).loading || false);

  watch(
    () => unref(tableProps).loading,
    (loading) => {
      loadingRef.value = loading || false;
    },
  );

  const getLoading = computed(() => unref(loadingRef));

  const setLoading = (loading: boolean) => {
    loadingRef.value = loading;
  };

  return { getLoading, setLoading };
};
