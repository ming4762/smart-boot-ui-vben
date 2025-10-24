import { computed, provide, reactive, ref, watch } from 'vue';

import { SmartProviderConstants } from '../constants';

export const useProviderDict = (api: (args: any) => Promise<any>) => {
  // 字段数据
  const dictCodeData = reactive(new Map<string, Set<number>>());
  const dictDataMap = reactive(new Map<string, any[]>());

  const computedDictCodeList = computed(() => {
    return [...dictCodeData.keys()];
  });

  const idToCodes = new Map<number, Set<string>>();

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
  const loadDictData = async (codeList: string[]) => {
    if (codeList.length === 0) {
      // 清空
      dictDataMap.clear();
      return;
    }
    const noLoadDictCodeList: string[] = [];
    codeList.forEach((item) => {
      if (!dictDataMap.has(item)) {
        noLoadDictCodeList.push(item);
      }
    });
    // 移除不存在的字典数据
    [...dictDataMap.keys()].forEach((item) => {
      if (!codeList.includes(item)) {
        dictDataMap.delete(item);
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
    computedDictCodeList,
    (codeList) => {
      loadDictData(codeList);
    },
    { immediate: true },
  );

  /**
   * 注入注册函数
   */
  provide(
    SmartProviderConstants.dictRegisterKey,
    (instanceId: number, ...codeList: string[]) => {
      codeList.forEach((code) => {
        if (!dictCodeData.has(code)) {
          dictCodeData.set(code, new Set());
        }
        dictCodeData.get(code)?.add(instanceId);
        if (!idToCodes.has(instanceId)) {
          idToCodes.set(instanceId, new Set());
        }
        idToCodes.get(instanceId)?.add(code);
      });
    },
  );

  /**
   * 注入注销函数
   */
  provide(SmartProviderConstants.dictUnregisterKey, (instanceId: number) => {
    const codes = idToCodes.get(instanceId);
    if (!codes) {
      return;
    }
    idToCodes.delete(instanceId);
    for (const code of codes) {
      const ids = dictCodeData.get(code);
      if (!ids) {
        continue;
      }
      ids.delete(instanceId);
      if (ids.size === 0) {
        dictCodeData.delete(code);
      }
    }
  });

  /**
   * 注入字典加载状态
   */
  provide(SmartProviderConstants.dictLoadingKey, dictLoadingRef);

  provide(SmartProviderConstants.dictData, dictDataMap);

  provide(SmartProviderConstants.dictMap, computedDictMap);

  provide(SmartProviderConstants.dictRegisterIdent, true);
};
