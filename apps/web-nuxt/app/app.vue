<script setup>
import { Button } from 'ant-design-vue';
import { useHead } from 'nuxt/app';

useHead({
  title: 'Smart Boot UI Next',
});

const handleClick = () => {
  // do nothing
};
</script>

<template>
  <div>
    <Button @click="handleClick" type="primary">Add</Button>
  </div>
</template>

<style scoped></style>
