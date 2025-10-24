import type { Ref } from 'vue';

import { getCurrentInstance, inject, onUnmounted, ref } from 'vue';

import { SmartProviderConstants } from '../constants';

/**
 * 注入页面字典
 */
export const useInjectPageDict = () => {
  const instance = getCurrentInstance();

  const injectRegister: (instanceId: number, ...code: string[]) => void =
    inject(SmartProviderConstants.dictRegisterKey, () => {});
  const pageDictRegister: (...codeList: string[]) => void = (...codeList) => {
    injectRegister(instance?.uid || 0, ...codeList);
  };
  const pageDictUnregister: (instanceId: number) => void = inject(
    SmartProviderConstants.dictUnregisterKey,
    () => {},
  );

  const pageDictLoadingRef: Ref<boolean> | undefined = inject(
    SmartProviderConstants.dictLoadingKey,
    ref(false),
  );

  const pageDictData: Map<string, Record<string, any>> | undefined = inject(
    SmartProviderConstants.dictData,
    new Map(),
  );

  const pageDictMap: Ref<Map<string, Map<string, string>>> = inject(
    SmartProviderConstants.dictMap,
    ref(new Map()),
  );

  const pageDictRegisterIdent: boolean = inject(
    SmartProviderConstants.dictRegisterIdent,
    false,
  );

  /**
   * 页面字典实例卸载时，自动注销字典
   */
  onUnmounted(() => {
    if (instance?.uid) {
      pageDictUnregister(instance.uid);
    }
  });

  return {
    pageDictData,
    pageDictLoadingRef,
    pageDictMap,
    pageDictRegister,
    pageDictRegisterIdent,
  };
};
