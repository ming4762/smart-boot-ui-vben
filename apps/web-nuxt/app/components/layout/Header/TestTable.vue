<script setup lang="ts">
import { useSmartTable } from '~/adapter/smart-table';

defineOptions({
  ssr: false,
});
const [Table] = useSmartTable({
  columns: [
    {
      field: 'abc',
      title: 'ceshi',
    },
  ],
  data: [
    {
      abc: '123',
    },
  ],
  toolbarConfig: {
    buttons: [
      {
        name: '123',
        customRender: 'ant',
        props: {
          type: 'primary',
          danger: true,
        },
      },
    ],
  },
});
</script>

<template>
  <Table />
</template>

<style scoped></style>
