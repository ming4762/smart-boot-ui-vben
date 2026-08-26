<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';

import { getIamLoginFailureApi } from '@smart/common/api';
import { useAuthStore } from '@smart/common/store';
import { Button, Spin } from 'antdv-next';

defineOptions({ name: 'IamLoginFailure' });

const UNKNOWN_ERROR_MESSAGE = '系统发生未知异常';
const REASON_MESSAGES: Record<string, string> = {
  client_not_found: '单点登录客户端不存在或已停用，请联系系统管理员。',
  invalid_authorization_request: '单点登录请求无效，请从业务系统重新发起登录。',
};

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const message = ref(UNKNOWN_ERROR_MESSAGE);
const showRetry = ref(true);

const loadFailureDetail = async () => {
  const reason = route.query.reason;
  if (typeof reason === 'string' && REASON_MESSAGES[reason]) {
    message.value = REASON_MESSAGES[reason];
    showRetry.value = false;
    loading.value = false;
    return;
  }

  const oauth2ErrorId = route.query.oauth2ErrorId;
  if (typeof oauth2ErrorId !== 'string' || !oauth2ErrorId) {
    loading.value = false;
    return;
  }
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
        <Button
          v-if="showRetry"
          type="primary"
          size="large"
          @click="retryLogin"
        >
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
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 32px 20px;
}

.failure-card {
  width: min(100%, 460px);
  padding: 40px 36px 36px;
  text-align: center;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 18px;
  box-shadow:
    0 24px 60px rgb(15 23 42 / 10%),
    0 4px 14px rgb(15 23 42 / 5%);
}

.error-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  font-size: 42px;
  font-weight: 600;
  line-height: 1;
  color: #dc2626;
  background: #fef2f2;
  border: 7px solid #fee2e2;
  border-radius: 50%;
}

h1 {
  margin: 0 0 14px;
  font-size: 26px;
  font-weight: 650;
  color: hsl(var(--foreground));
  letter-spacing: -0.02em;
}

.failure-message {
  min-height: 24px;
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: hsl(var(--foreground));
}

.failure-tip {
  margin: 14px 0 28px;
  font-size: 14px;
  line-height: 1.6;
  color: hsl(var(--muted-foreground));
}

.failure-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
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
