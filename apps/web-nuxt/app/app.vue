<script setup>
import { ConfigProvider, theme } from 'ant-design-vue';

useHead({
  title: 'Smart Boot UI Next',
});

const darkModeCookie = useCookie('dark-mode');
// const { tokens } = useAntdDesignTokens();

const tokenTheme = computed(() => {
  const isDark = darkModeCookie.value === 'dark';
  const algorithm = isDark ? [theme.darkAlgorithm] : [theme.defaultAlgorithm];

  return {
    algorithm,
  };
});
</script>

<template>
  <ConfigProvider :theme="tokenTheme">
    <NuxtLayout name="basic">
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>

<style scoped></style>
