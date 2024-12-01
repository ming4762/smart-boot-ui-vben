import type { SmartAppProviderProps } from '../types';

import { inject, type InjectionKey, provide, unref } from 'vue';

const key: InjectionKey<SmartAppProviderProps> = Symbol('smart-app-rovider');

/**
 * 注入上下文
 * @param props
 */
const useProviderSmartAppContext = (props: SmartAppProviderProps) => {
  provide(key, { ...unref(props) });
};

const useSmartAppContext = (): SmartAppProviderProps => {
  return inject<SmartAppProviderProps>(key) || {};
};

export { useProviderSmartAppContext, useSmartAppContext };
