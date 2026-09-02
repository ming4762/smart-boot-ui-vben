import type { Pinia } from 'pinia';

import type { App } from 'vue';

import { createPinia } from 'pinia';
import SecureLS from 'secure-ls';

let pinia: Pinia;

type SecureLSStorage = {
  get(key: string): any;
  set(key: string, value: unknown): void;
};

type SecureLSCtor = new (config?: {
  encodingType?: string;
  encryptionSecret?: string;
  isCompression?: boolean;
  metaKey?: string;
}) => SecureLSStorage;

const secureLSModule = SecureLS as unknown as {
  default?: SecureLSCtor;
  SecureLS?: SecureLSCtor;
};

const SecureLSConstructor =
  secureLSModule.default ??
  secureLSModule.SecureLS ??
  (SecureLS as unknown as SecureLSCtor);

/**
 * 依赖当前布局生命周期，需要在路由离开后重置的 Store。
 */
const AFTER_ROUTE_LEAVE_RESET_STORE_IDS = new Set(['core-tabbar']);

export interface InitStoreOptions {
  /**
   * @zh_CN 应用名,由于 @vben/stores 是公用的，后续可能有多个app，为了防止多个app缓存冲突，可在这里配置应用名,应用名将被用于持久化的前缀
   */
  namespace: string;
}

/**
 * @zh_CN 初始化pinia
 */
export async function initStores(app: App, options: InitStoreOptions) {
  const { createPersistedState } = await import('pinia-plugin-persistedstate');
  pinia = createPinia();
  const { namespace } = options;
  const ls = new SecureLSConstructor({
    encodingType: 'aes',
    encryptionSecret: import.meta.env.VITE_APP_STORE_SECURE_KEY,
    isCompression: true,
    metaKey: `${namespace}-secure-meta`,
  });
  pinia.use(
    createPersistedState({
      // key $appName-$store.id
      key: (storeKey) => `${namespace}-${storeKey}`,
      storage: import.meta.env.DEV
        ? localStorage
        : {
            getItem(key) {
              return ls.get(key);
            },
            setItem(key, value) {
              ls.set(key, value);
            },
          },
    }),
  );
  app.use(pinia);
  return pinia;
}

function resetStores(shouldReset: (storeId: string) => boolean) {
  if (!pinia) {
    console.error('Pinia is not installed');
    return;
  }
  const allStores = (pinia as any)._s;
  for (const [_key, store] of allStores) {
    if (shouldReset(store.$id)) {
      store.$reset();
    }
  }
}

/**
 * @zh_CN 重置所有 Store
 */
export function resetAllStores() {
  resetStores(() => true);
}

/**
 * @zh_CN 重置不依赖当前布局生命周期的 Store
 */
export function resetStoresBeforeRouteLeave() {
  resetStores(
    (storeId) => !AFTER_ROUTE_LEAVE_RESET_STORE_IDS.has(storeId),
  );
}

/**
 * @zh_CN 路由离开后，重置依赖当前布局生命周期的 Store
 */
export function resetStoresAfterRouteLeave() {
  resetStores((storeId) => AFTER_ROUTE_LEAVE_RESET_STORE_IDS.has(storeId));
}
