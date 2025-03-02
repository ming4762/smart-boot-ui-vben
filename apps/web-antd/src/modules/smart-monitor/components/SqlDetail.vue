<script setup lang="ts">
interface Props {
  detail?: Record<string, any>;
}

const props = defineProps<Props>();
</script>

<template>
  <div>{{ props.detail }}</div>
</template>

<style scoped></style>
