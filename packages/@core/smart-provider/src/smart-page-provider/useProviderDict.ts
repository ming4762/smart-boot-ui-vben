import { computed, provide, reactive, ref, watch } from 'vue';

import { SmartProviderConstants } from '../constants';

export const useProviderDict = (api: (args: any) => Promise<any>) => {
  const dictCodeList = reactive<Set<string>>(new Set<string>());
  const dictDataMap = reactive(new Map<string, any[]>());

  // 字典加载状态
  const dictLoadingRef = ref(false);

  const computedDictMap = computed(() => {
    const resultMap: Map<string, Map<string, string>> = new Map();

    dictDataMap.forEach((list, key) => {
      const itemMap: Map<string, string> = new Map();
      list.forEach((item: any) => {
        itemMap.set(item.dictItemCode, item.dictItemName);
      });
      resultMap.set(key, itemMap);
    });

    return resultMap;
  });

  /**
   * 批量加载字典数据
   */
  const loadDictData = async () => {
    if (dictCodeList.size === 0) {
      return;
    }
    const noLoadDictCodeList: string[] = [];
    dictCodeList.forEach((item) => {
      if (!dictDataMap.has(item)) {
        noLoadDictCodeList.push(item);
      }
    });
    if (noLoadDictCodeList.length === 0) {
      return;
    }
    try {
      dictLoadingRef.value = true;
      const result: Record<string, any[]> =
        (await api(noLoadDictCodeList)) || {};
      for (const key in result) {
        dictDataMap.set(
          key,
          (result?.[key] as any[]).map((item: any) => {
            return {
              ...item,
              label: item.dictItemName,
              value: item.dictItemCode,
            };
          }),
        );
      }
    } finally {
      dictLoadingRef.value = false;
    }
  };

  watch(
    dictCodeList,
    () => {
      loadDictData();
    },
    { immediate: true },
  );

  /**
   * 注入注册函数
   */
  provide(SmartProviderConstants.dictRegisterKey, (...code: string[]) => {
    code.forEach((item) => dictCodeList.add(item));
  });

  /**
   * 注入字典加载状态
   */
  provide(SmartProviderConstants.dictLoadingKey, dictLoadingRef);

  provide(SmartProviderConstants.dictData, dictDataMap);

  provide(SmartProviderConstants.dictMap, computedDictMap);

  provide(SmartProviderConstants.dictRegisterIdent, true);
};
