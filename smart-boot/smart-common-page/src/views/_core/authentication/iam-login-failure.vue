<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';

import { getIamLoginFailureApi } from '@smart/common/api';
import { useAuthStore } from '@smart/common/store';
import { Button, Spin } from 'antdv-next';

defineOptions({ name: 'IamLoginFailure' });

const UNKNOWN_ERROR_MESSAGE = '系统发生未知异常';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const message = ref(UNKNOWN_ERROR_MESSAGE);

const loadFailureDetail = async () => {
  const oauth2ErrorId = route.query.oauth2ErrorId;
  if (typeof oauth2ErrorId !== 'string' || !oauth2ErrorId) {
    loading.value = false;
    return;
  }
  console.log('=======')
  try {
    const result = await getIamLoginFailureApi(oauth2ErrorId);
    message.value = result.message || UNKNOWN_ERROR_MESSAGE;
  } catch {
    message.value = UNKNOWN_ERROR_MESSAGE;
  } finally {
    loading.value = false;
  }
};

const retryLogin = () => {
  const homeUrl = new URL(router.resolve('/').href, window.location.origin);
  const loginUrl = authStore.getIamLoginUrl(homeUrl.toString());
  if (loginUrl) {
    window.location.assign(loginUrl);
  }
};

const backToLogin = () => {
  router.replace(LOGIN_PATH);
};

onMounted(loadFailureDetail);
</script>

<template>
  <main class="iam-login-failure">
    <section class="failure-card" aria-labelledby="iam-login-failure-title">
      <div class="error-icon" aria-hidden="true">!</div>
      <h1 id="iam-login-failure-title">单点登录失败</h1>
      <Spin :spinning="loading">
        <p class="failure-message">
          {{ loading ? '正在获取登录失败信息…' : message }}
        </p>
      </Spin>
      <p class="failure-tip">
        你可以重新发起单点登录，或返回登录页选择其他登录方式。
      </p>
      <div class="failure-actions">
        <Button type="primary" size="large" @click="retryLogin">
          重新登录
        </Button>
        <Button size="large" @click="backToLogin">返回登录页</Button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.iam-login-failure {
  display: flex;
  width: 100%;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}

.failure-card {
  width: min(100%, 460px);
  padding: 40px 36px 36px;
  text-align: center;
  border: 1px solid hsl(var(--border));
  border-radius: 18px;
  background: hsl(var(--card));
  box-shadow:
    0 24px 60px rgb(15 23 42 / 10%),
    0 4px 14px rgb(15 23 42 / 5%);
}

.error-icon {
  display: grid;
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  color: #dc2626;
  font-size: 42px;
  font-weight: 600;
  line-height: 1;
  place-items: center;
  border: 7px solid #fee2e2;
  border-radius: 50%;
  background: #fef2f2;
}

h1 {
  margin: 0 0 14px;
  color: hsl(var(--foreground));
  font-size: 26px;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.failure-message {
  min-height: 24px;
  margin: 0;
  color: hsl(var(--foreground));
  font-size: 16px;
  line-height: 1.6;
}

.failure-tip {
  margin: 14px 0 28px;
  color: hsl(var(--muted-foreground));
  font-size: 14px;
  line-height: 1.6;
}

.failure-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.failure-actions :deep(.ant-btn) {
  min-width: 120px;
  border-radius: 9px;
}

@media (max-width: 520px) {
  .failure-card {
    padding: 34px 24px 28px;
  }

  .failure-actions {
    flex-direction: column;
  }

  .failure-actions :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
