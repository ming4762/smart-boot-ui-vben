<script setup lang="ts">
interface Props {
  title: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="bas-container">
    <div class="header-container">
      <span class="container-title">{{ props.title }}</span>
    </div>
    <div class="content-container p-2">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-container {
  height: 32px;
  border-bottom: 1px solid hsl(var(--border));
  align-items: center;
  display: flex;
}
.container-title {
  font-size: 14px;
  font-weight: 500;
  padding-left: 10px;
}
.content-container {
  height: calc(100% - 32px);
}
</style>
