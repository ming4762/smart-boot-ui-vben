<script setup lang="ts">
import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
  toRefs,
  useAttrs,
} from 'vue';
import { useRoute } from 'vue-router';

import WujieVue from 'wujie-vue3';

import { useEmitMainRouteChange } from '#/bus';
import { concatUrlPaths } from '#/helper';

interface Props {
  baseUrl: string;
  // 是否多实例
  multiInstanceYn: boolean;
  name: string;
  pageUrl?: string;
  routeLinkageYn?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  routeLinkageYn: false,
  pageUrl: undefined,
});
const attrs = useAttrs();
const route = useRoute();

const activeRef = ref(false);

const { routeLinkageYn: routeLinkageYnRef } = toRefs(props);

/**
 * 微前端地址
 */
const computedUrl = computed(() => {
  const routeLinkageYn = routeLinkageYnRef.value;
  if (!routeLinkageYn) {
    return concatUrlPaths(props.baseUrl, props.pageUrl);
  }
  return concatUrlPaths(props.baseUrl, route.path);
});

onBeforeUnmount(() => {
  if (props.multiInstanceYn) {
    // 多实例时，需要手动销毁微应用实例
    WujieVue.destroyApp(props.name);
  }
});

/**
 * 设置微前端激活状态
 */
onActivated(() => {
  activeRef.value = true;
});
onDeactivated(() => {
  activeRef.value = false;
});

// 监听主应用路由变化，触发微前端路由变化事件
if (props.routeLinkageYn) {
  useEmitMainRouteChange(props.name);
}
</script>

<template>
  <div class="wujie-wrapper">
    {{ computedUrl }}
    <WujieVue
      class="wujie-wrapper"
      :url="computedUrl"
      :name="props.name"
      v-bind="attrs"
    />
  </div>
</template>

<style lang="less">
.wujie-wrapper {
  width: 100%;
  height: 100%;
}
</style>
