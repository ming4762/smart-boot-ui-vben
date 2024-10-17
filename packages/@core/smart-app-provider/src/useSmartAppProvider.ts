import type { SmartAppProviderProps } from './types';

import { inject, type InjectionKey, provide, unref } from 'vue';

const key: InjectionKey<SmartAppProviderProps> = Symbol('smart-app-rovider');

/**
 * 注入上下文
 * @param props
 */
const useInjectSmartAppContext = (props: SmartAppProviderProps) => {
  provide(key, { ...unref(props) });
};

const useSmartAppContext = () => {
  return inject<SmartAppProviderProps>(key);
};

export { useInjectSmartAppContext, useSmartAppContext };
