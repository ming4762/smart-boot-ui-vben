import type { MenuRecordRaw } from '@vben/types';

import { computed, ref } from 'vue';

import { useAccessStore, useSysPropertiesStore } from '@vben/stores';

import { defineStore } from 'pinia';

import {
  batchDeleteFavoriteFunctionsApi,
  deleteFavoriteFunctionApi,
  saveFavoriteFunctionApi,
} from '../api';

const DEFAULT_MAX_COUNT = 10;
const FAVORITE_ROOT_KEY = 'favorite:root';

export const useMenuFavoriteStore = defineStore('menu-favorite', () => {
  const accessStore = useAccessStore();
  const sysPropertiesStore = useSysPropertiesStore();
  const favoriteFunctionIds = ref<number[]>([]);
  const loadingFunctionIds = ref<number[]>([]);
  const loaded = ref(false);

  const maxCount = computed(() => {
    const value = Number(
      sysPropertiesStore.sysParameter?.['sys.function.favorite.maxCount'],
    );
    return Number.isInteger(value) && value > 0 ? value : DEFAULT_MAX_COUNT;
  });
  const reachedLimit = computed(
    () => favoriteFunctionIds.value.length >= maxCount.value,
  );

  function isFavorite(functionId?: number) {
    return !!functionId && favoriteFunctionIds.value.includes(functionId);
  }

  function isLoading(functionId?: number) {
    return !!functionId && loadingFunctionIds.value.includes(functionId);
  }

  function setLoaded(value: boolean) {
    loaded.value = value;
  }

  function setFavoriteFunctionIds(functionIds: number[]) {
    favoriteFunctionIds.value = [...functionIds];
    loaded.value = true;
  }

  function getBaseMenus(menus: MenuRecordRaw[]) {
    return menus.filter(
      (menu) => (menu.key ?? menu.path) !== FAVORITE_ROOT_KEY,
    );
  }

  function buildMenuMap(menus: MenuRecordRaw[]) {
    const menuMap = new Map<number, MenuRecordRaw>();
    const visit = (items: MenuRecordRaw[]) => {
      items.forEach((menu) => {
        if (menu.functionId) {
          menuMap.set(menu.functionId, menu);
        }
        if (menu.children?.length) {
          visit(menu.children);
        }
      });
    };
    visit(menus);
    return menuMap;
  }

  function decorateMenus(menus: MenuRecordRaw[]) {
    const baseMenus = getBaseMenus(menus);
    if (!loaded.value || favoriteFunctionIds.value.length === 0) {
      return baseMenus;
    }

    const menuMap = buildMenuMap(baseMenus);
    const unavailableIds: number[] = [];
    const children: MenuRecordRaw[] = favoriteFunctionIds.value.flatMap(
      (functionId): MenuRecordRaw[] => {
        const source = menuMap.get(functionId);
        if (!source) {
          unavailableIds.push(functionId);
          return [];
        }
        return [
          {
            ...source,
            children: undefined,
            favoriteShortcut: true,
            key: `favorite:${functionId}`,
            parent: FAVORITE_ROOT_KEY,
            parents: [FAVORITE_ROOT_KEY],
            query: {
              ...source.query,
              _favoriteMenuId: String(functionId),
            },
            targetPath: source.targetPath ?? source.path,
          },
        ];
      },
    );

    if (unavailableIds.length > 0) {
      children.push({
        disabled: true,
        favoriteCleanup: true,
        key: 'favorite:cleanup',
        name: `${unavailableIds.length} 个收藏当前不可用`,
        path: 'favorite:cleanup',
        show: true,
        targetPath: '',
      });
    }

    return [
      {
        children,
        icon: 'lucide:star',
        key: FAVORITE_ROOT_KEY,
        name: '我的收藏',
        path: FAVORITE_ROOT_KEY,
        searchable: false,
        show: true,
      },
      ...baseMenus,
    ] as MenuRecordRaw[];
  }

  function refreshMenus() {
    accessStore.setAccessMenus(decorateMenus(accessStore.accessMenus));
  }

  function setLoading(functionId: number, value: boolean) {
    loadingFunctionIds.value = value
      ? [...loadingFunctionIds.value, functionId]
      : loadingFunctionIds.value.filter((id) => id !== functionId);
  }

  async function add(functionId: number) {
    if (isFavorite(functionId) || isLoading(functionId) || reachedLimit.value) {
      return;
    }
    setLoading(functionId, true);
    favoriteFunctionIds.value = [functionId, ...favoriteFunctionIds.value];
    refreshMenus();
    try {
      await saveFavoriteFunctionApi(functionId);
    } catch (error) {
      favoriteFunctionIds.value = favoriteFunctionIds.value.filter(
        (id) => id !== functionId,
      );
      refreshMenus();
      throw error;
    } finally {
      setLoading(functionId, false);
    }
  }

  async function remove(functionId: number) {
    if (!isFavorite(functionId) || isLoading(functionId)) {
      return;
    }
    const previousIds = [...favoriteFunctionIds.value];
    setLoading(functionId, true);
    favoriteFunctionIds.value = favoriteFunctionIds.value.filter(
      (id) => id !== functionId,
    );
    refreshMenus();
    try {
      await deleteFavoriteFunctionApi(functionId);
    } catch (error) {
      favoriteFunctionIds.value = previousIds;
      refreshMenus();
      throw error;
    } finally {
      setLoading(functionId, false);
    }
  }

  async function clearUnavailable() {
    const baseMenus = getBaseMenus(accessStore.accessMenus);
    const menuMap = buildMenuMap(baseMenus);
    const unavailableIds = favoriteFunctionIds.value.filter(
      (functionId) => !menuMap.has(functionId),
    );
    if (unavailableIds.length === 0) {
      return;
    }
    const previousIds = [...favoriteFunctionIds.value];
    favoriteFunctionIds.value = favoriteFunctionIds.value.filter(
      (id) => !unavailableIds.includes(id),
    );
    refreshMenus();
    try {
      await batchDeleteFavoriteFunctionsApi(unavailableIds);
    } catch (error) {
      favoriteFunctionIds.value = previousIds;
      refreshMenus();
      throw error;
    }
  }

  function $reset() {
    favoriteFunctionIds.value = [];
    loadingFunctionIds.value = [];
    loaded.value = false;
  }

  return {
    $reset,
    add,
    clearUnavailable,
    decorateMenus,
    favoriteFunctionIds,
    isFavorite,
    isLoading,
    loaded,
    maxCount,
    reachedLimit,
    remove,
    setFavoriteFunctionIds,
    setLoaded,
  };
});
