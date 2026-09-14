import type { VxeUIPluginObject } from '@vben/common-ui';

import { ref, unref } from 'vue';

import {
  listCurrentUserVxeConfigApi,
  saveVxeConfigApi,
} from '@smart/common/api';
import { defineStore } from 'pinia';

const useSmartTableCustomStorageDBStore = defineStore(
  'smart-table-plugin-custom-db',
  () => {
    const configMapRef = ref(new Map<string, any>());
    let isInit = false;
    // 用来缓存初始化的 Promise
    let initPromise: null | Promise<void> = null;

    const saveConfigToDb = async (key: string, configData: any) => {
      try {
        await saveVxeConfigApi(key, JSON.stringify(configData));
      } catch (error) {
        // do nothing
        console.error('save config to db failed', error);
      }
    };

    const setConfig = (key: string, configData: any) => {
      unref(configMapRef).set(key, configData);
      saveConfigToDb(key, configData);
    };

    const initConfig = async () => {
      try {
        const dbConfig = await listCurrentUserVxeConfigApi();
        configMapRef.value = dbConfig
          ? new Map(
              dbConfig.map((item: any) => [
                item.configKey,
                JSON.parse(item.configValue),
              ]),
            )
          : new Map();
        isInit = true;
      } catch (error) {
        // do nothing
        console.error('init config failed', error);
      } finally {
        initPromise = null;
      }
    };

    const getConfig = (key: string) => {
      if (!isInit && !initPromise) {
        initPromise = initConfig(); // 初始化时缓存 Promise，其他并发的调用会等待它
      }
      if (initPromise === null) {
        return unref(configMapRef).get(key);
      }
      return initPromise.then(() => unref(configMapRef).get(key));
    };

    function $reset() {
      configMapRef.value = new Map();
      isInit = false;
      initPromise = null;
    }

    return {
      $reset,
      setConfig,
      getConfig,
    };
  },
);

export const SmartTableCustomStorageDBPlugin: VxeUIPluginObject = {
  install(VxeUI) {
    VxeUI.setConfig({
      table: {
        customConfig: {
          updateStore: ({ id, storeData }) => {
            const store = useSmartTableCustomStorageDBStore();
            store.setConfig(id, storeData);
            return Promise.resolve({});
          },
          restoreStore: ({ id }) => {
            const store = useSmartTableCustomStorageDBStore();
            return store.getConfig(id);
          },
        },
      },
    });
  },
};
