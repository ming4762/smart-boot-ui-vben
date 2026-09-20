import type { Pinia } from 'pinia';

import type { App } from 'vue';

import { createPinia } from 'pinia';
import SecureLS from 'secure-ls';

let pinia: Pinia;

type SecureLSStorage = {
  get(key: string): any;
  remove(key: string): void;
  set(key: string, value: unknown): void;
};

type PersistStorage = {
  getItem(key: string): null | string;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
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

/**
 * 清理旧版本持久化数据中的认证令牌。
 *
 * 无法解析旧数据时直接删除 access Store，确保历史凭证不会继续留在浏览器存储中。
 *
 * @param storage Pinia 持久化存储
 * @param key access Store 的持久化键
 */
function removeLegacyAuthTokens(storage: PersistStorage, key: string) {
  const persistedState = storage.getItem(key);
  if (!persistedState) {
    return;
  }
  try {
    const state = JSON.parse(persistedState) as Record<string, unknown>;
    delete state.accessToken;
    delete state.refreshToken;
    storage.setItem(key, JSON.stringify(state));
  } catch {
    storage.removeItem(key);
  }
}

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
  const storage: PersistStorage = import.meta.env.DEV
    ? localStorage
    : {
        getItem(key) {
          return ls.get(key);
        },
        removeItem(key) {
          ls.remove(key);
        },
        setItem(key, value) {
          ls.set(key, value);
        },
      };

  removeLegacyAuthTokens(storage, `${namespace}-core-access`);
  pinia.use(
    createPersistedState({
      // key $appName-$store.id
      key: (storeKey) => `${namespace}-${storeKey}`,
      storage,
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
