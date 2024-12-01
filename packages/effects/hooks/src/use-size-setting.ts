import { computed } from 'vue';

import { useSmartAppContext } from '@vben/preferences';

export const useSizeSetting = () => {
  const { size } = useSmartAppContext();

  const getTableSize = computed(() => size?.table);
  const getButtonSize = computed(() => size?.button);
  const getFormSize = computed(() => size?.form);

  return {
    getButtonSize,
    getTableSize,
    getFormSize,
  };
};
