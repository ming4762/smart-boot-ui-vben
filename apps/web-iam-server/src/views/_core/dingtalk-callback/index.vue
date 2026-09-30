<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@smart/common/store';

/** 钉钉授权完成后接收临时授权码，并由后端建立系统登录态。 */
defineOptions({ name: 'DingtalkCallback' });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref('');

/** 从回调参数中读取单值，拒绝重复参数造成的歧义。 */
function singleQueryValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/** 回调页只提交一次授权码；刷新或返回时由后端的一次性 state 拒绝重放。 */
onMounted(async () => {
  // 授权码是一次性凭证，读取后立即从地址栏清除，避免留在浏览器历史中。
  const code =
    singleQueryValue(route.query.code) ??
    singleQueryValue(route.query.authCode);
  const state = singleQueryValue(route.query.state);
  const authorizationError = singleQueryValue(route.query.error);
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname,
  );

  if (authorizationError) {
    errorMessage.value = '钉钉授权未完成，请返回登录页重试';
    return;
  }
  if (!code || !state) {
    errorMessage.value = '钉钉登录回调缺少必要参数';
    return;
  }
  try {
    await authStore.completeDingtalkLogin(code, state);
  } catch {
    errorMessage.value = '钉钉登录失败或授权已失效，请重新扫码';
  }
});
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-md flex-col items-center gap-4 p-6 text-center"
  >
    <template v-if="errorMessage">
      <p role="alert">{{ errorMessage }}</p>
      <button
        class="min-h-11 rounded-md bg-primary px-5 text-primary-foreground"
        type="button"
        @click="router.replace('/auth/login')"
      >
        返回登录
      </button>
    </template>
    <p v-else role="status">正在完成钉钉登录…</p>
  </div>
</template>
