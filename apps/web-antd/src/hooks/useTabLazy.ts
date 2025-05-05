import type { Ref } from 'vue';

import { ref, unref, watch } from 'vue';

/**
 * tab懒加载
 * 当tab切换时，如果tab没有激活，则不加载数据
 * 当tab激活时，如果triggerRef变化，则加载数据
 * 当tab激活时，如果triggerRef没有变化，则不加载数据
 * @param triggerRef
 * @param actived
 * @param handler
 */
export const useTabLazy = (
  triggerRef: Ref<any>,
  actived: Ref<boolean>,
  handler: () => any,
) => {
  /**
   * 上次触发的trigger
   */
  const lastTriggerRef = ref<any>(null);

  const doHandler = () => {
    if (unref(lastTriggerRef) !== unref(triggerRef)) {
      handler();
      lastTriggerRef.value = unref(triggerRef);
    }
  };

  watch(actived, (value) => {
    if (value) {
      doHandler();
    }
  });

  watch(triggerRef, () => {
    if (unref(actived)) {
      doHandler();
    }
  });
};
