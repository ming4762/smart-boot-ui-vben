import { computed, ComputedRef, unref } from 'vue';
import type { SmartTableProps, SmartTableSeqConfig } from '@/components/SmartTable';
import { VxeGridPropTypes } from 'vxe-table';

export const useSmartTableSeqConfig = (
  propsRef: ComputedRef<SmartTableProps>,
  getPagination: () => VxeGridPropTypes.PagerConfig | undefined,
) => {
  const computedSeqConfig = computed<SmartTableSeqConfig | undefined>(() => {
    const { seqConfig, pagerConfig } = unref(propsRef);
    if (!seqConfig) {
      return undefined;
    }
    if (!pagerConfig) {
      return seqConfig;
    }
    const { seqBindPage } = seqConfig;
    if (!seqBindPage) {
      return seqConfig;
    }
    return {
      seqMethod({ rowIndex }) {
        const { currentPage, pageSize } = getPagination() || {};
        return (currentPage! - 1) * pageSize! + rowIndex + 1;
      },
      ...seqConfig,
    };
  });
  return {
    computedSeqConfig,
  };
};
