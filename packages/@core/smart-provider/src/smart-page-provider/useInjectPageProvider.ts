import type { ComputedRef, Ref } from 'vue';

import { inject, ref } from 'vue';

import { SmartProviderConstants } from '../constants';

/**
 * 注入页面字典
 */
export const useInjectPageDict = () => {
  const pageDictRegister: (...code: string[]) => void = inject(
    SmartProviderConstants.dictRegisterKey,
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

  const pageDictMap:
    | ComputedRef<Record<string, Record<string, any>>>
    | undefined = inject(SmartProviderConstants.dictMap, undefined);

  const pageDictRegisterIdent: boolean = inject(
    SmartProviderConstants.dictRegisterIdent,
    false,
  );
  return {
    pageDictData,
    pageDictLoadingRef,
    pageDictMap,
    pageDictRegister,
    pageDictRegisterIdent,
  };
};
