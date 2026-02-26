<script setup lang="ts">
import { testApi } from '~/api/system/test';

const data = ref<any>({});
onMounted(async () => {
  data.value = await testApi();
});
</script>

<template>
  <div>
    <span>这是顶部菜单项</span>
  </div>
</template>

<style scoped></style>
