<script setup lang="ts">
import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
  useAttrs,
} from 'vue';

import WujieVue from 'wujie-vue3';

import { useEmitMainRouteChange } from '#/bus';

interface Props {
  // 是否多实例
  multiInstanceYn: boolean;
  name: string;
}

const props = defineProps<Props>();
const attrs = useAttrs();

const activeRef = ref(false);

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
useEmitMainRouteChange();
</script>

<template>
  <div class="wujie-wrapper">
    {{ activeRef }}
    <WujieVue class="wujie-wrapper" :name="props.name" v-bind="attrs" />
  </div>
</template>

<style lang="less">
.wujie-wrapper {
  width: 100%;
  height: 100%;
}
</style>
