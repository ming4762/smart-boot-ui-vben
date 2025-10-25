<script setup lang="ts">
import { computed } from 'vue';

import { VbenAvatar } from '../avatar';

interface Props {
  /**
   * @zh_CN 是否收起文本
   */
  collapsed?: boolean;
  /**
   * @zh_CN Logo 图片适应方式
   */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * @zh_CN Logo 跳转地址
   */
  href?: string;
  /**
   * @zh_CN Logo 图片大小
   */
  logoHeight?: number;
  sourceDark?: string;
  sourceLight?: string;
  sourceWithTitleDark?: string;
  sourceWithTitleLight?: string;
  /**
   * @zh_CN Logo 图标
   */
  src?: string;
  /**
   * @zh_CN Logo 文本
   */
  text: string;
  /**
   * @zh_CN Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'VbenLogo',
});

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  href: 'javascript:void 0',
  logoHeight: 30,
  src: '',
  theme: 'light',
  fit: 'cover',
});

const computedLogoWithTitleSrc = computed(() => {
  if (props.theme === 'dark') {
    return props.sourceWithTitleDark;
  }
  return props.sourceWithTitleLight;
});

const computedLogoSrc = computed(() => {
  if (props.theme === 'dark') {
    return props.sourceDark;
  }
  return props.sourceLight;
});
</script>

<template>
  <div :class="theme" class="flex h-full items-center text-lg">
    <a
      :class="$attrs.class"
      :href="href"
      class="flex h-full items-center gap-2 overflow-hidden px-3 text-lg leading-normal transition-all duration-500"
    >
      <div
        v-if="!collapsed"
        class="text-foreground animation-scale truncate text-nowrap font-semibold"
      >
        <VbenAvatar
          v-if="!collapsed && computedLogoWithTitleSrc"
          :height="props.logoHeight"
          :alt="text"
          :src="computedLogoWithTitleSrc"
          :fit="fit"
          class="relative rounded-none bg-transparent"
        />
      </div>
      <div
        v-else
        class="text-foreground animation-scale truncate text-nowrap font-semibold"
      >
        <VbenAvatar
          :height="props.logoHeight"
          v-if="computedLogoSrc"
          :alt="text"
          :src="computedLogoSrc"
          :fit="fit"
          class="relative rounded-none bg-transparent"
        />
      </div>
    </a>
  </div>
</template>
<style scoped>
.animation-scale {
  animation: scale-in 0.2s ease-out;
}

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
