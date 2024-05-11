import { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '@/hooks/core/useContext';

export interface AppProviderForm {
  autoSubmitOnEnter?: boolean;
}

/**
 * modal配置
 */
export interface AppProviderModal {
  // 点击蒙层是否允许关闭
  maskClosable?: boolean;
}

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
  form: Ref<AppProviderForm | undefined>;
  modal: Ref<AppProviderModal | undefined>;
}

const key: InjectionKey<AppProviderContextProps> = Symbol();

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
