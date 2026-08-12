<script lang="ts" setup>
import type { MenuRecordRaw } from '@vben/types';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { LoaderCircle, Star } from '@vben/icons';

import { useMenuFavoriteStore } from '@smart/common/store';
import { createConfirm } from '@smart/common/utils';

const props = defineProps<{
  menu: MenuRecordRaw;
}>();

const favoriteStore = useMenuFavoriteStore();
const route = useRoute();
const router = useRouter();

const functionId = computed(() => props.menu.functionId);
const favorite = computed(() => favoriteStore.isFavorite(functionId.value));
const loading = computed(() => favoriteStore.isLoading(functionId.value));
const disabled = computed(() => !favorite.value && favoriteStore.reachedLimit);
const tooltip = computed(() => {
  if (disabled.value) {
    return `最多收藏 ${favoriteStore.maxCount} 个，请先取消其他收藏`;
  }
  return favorite.value ? '取消收藏' : '收藏菜单';
});

async function handleToggle() {
  if (!functionId.value || loading.value || disabled.value) {
    return;
  }
  if (favorite.value) {
    await favoriteStore.remove(functionId.value);
    if (String(route.query._favoriteMenuId) === String(functionId.value)) {
      const { _favoriteMenuId: _ignored, ...query } = route.query;
      await router.replace({ path: route.path, query });
    }
  } else {
    await favoriteStore.add(functionId.value);
  }
}

function handleCleanup() {
  createConfirm({
    content: '确定清理当前不可用的菜单收藏吗？',
    onOk: () => favoriteStore.clearUnavailable(),
  });
}
</script>

<template>
  <button
    v-if="menu.favoriteCleanup"
    class="ml-auto shrink-0 text-xs text-primary"
    type="button"
    @click.prevent.stop="handleCleanup"
  >
    清理
  </button>
  <button
    v-else-if="favoriteStore.loaded && menu.favoritable && functionId"
    :aria-label="tooltip"
    class="ml-auto flex size-6 shrink-0 items-center justify-center rounded transition-opacity hover:bg-foreground/10"
    :class="favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
    :disabled="disabled || loading"
    :title="tooltip"
    type="button"
    @click.prevent.stop="handleToggle"
  >
    <LoaderCircle v-if="loading" class="size-4 animate-spin" />
    <Star
      v-else
      class="size-4"
      :class="favorite ? 'fill-current text-warning' : ''"
    />
  </button>
</template>
