<script setup lang="ts">
interface Props {
  content?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
});
</script>

<template>
  <div class="smart-tinymce-preview" v-html="props.content"></div>
</template>

<style scoped>
.smart-tinymce-preview {
  :deep(ol) {
    margin-left: 1.5em;
    list-style-type: decimal;
  }

  :deep(ul) {
    margin-left: 1.5em;
    list-style-type: disc;
  }
}
</style>
