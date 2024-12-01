import { computed, onMounted, provide, reactive, ref, watch } from 'vue';

import { SmartProviderConstants } from '../constants';

export const useProviderDict = (api: (args: any) => Promise<any>) => {
  let hasInitLoad = false;
  const dictCodeList = reactive<Set<string>>(new Set<string>());
  const dictDataMap = reactive(new Map<string, Record<string, any>>());

  // 字典加载状态
  const dictLoadingRef = ref(false);

  const computedDictMap = computed(() => {
    const result: Record<string, Record<string, any>> = {};

    dictDataMap.forEach((list, key) => {
      const itemMap: Record<string, any> = {};
      list.forEach((item: any) => {
        itemMap[item.dictItemCode] = item.dictItemName;
      });
      result[key] = itemMap;
    });

    return result;
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
      const result = (await api(noLoadDictCodeList)) || {};
      for (const key in result) {
        dictDataMap.set(
          key,
          result[key].map((item: any) => {
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

  onMounted(async () => {
    await loadDictData();
    hasInitLoad = true;
  });

  watch(dictCodeList, () => {
    if (hasInitLoad) {
      loadDictData();
    }
  });

  /**
   * 注入注册函数
   */
  provide(SmartProviderConstants.dictRegisterKey, (code: string) => {
    dictCodeList.add(code);
  });

  /**
   * 注入字典加载状态
   */
  provide(SmartProviderConstants.dictLoadingKey, dictLoadingRef);

  provide(SmartProviderConstants.dictData, dictDataMap);

  provide(SmartProviderConstants.dictMap, computedDictMap);

  provide(SmartProviderConstants.dictRegisterIdent, true);
};
