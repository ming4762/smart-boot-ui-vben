<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@smart/common/store';
import { Button } from 'antdv-next';

defineOptions({ name: 'LogoutSuccess' });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const serverLogoutSkipped = computed(
  () => route.query.server_logout === 'skipped',
);

const loginAgain = () => {
  const homeUrl = new URL(router.resolve('/').href, window.location.origin);
  const loginUrl = authStore.getIamLoginUrl(homeUrl.toString());
  if (loginUrl) {
    window.location.replace(loginUrl);
  }
};
</script>

<template>
  <main class="logout-success">
    <section class="success-card" aria-labelledby="logout-success-title">
      <div class="success-icon" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24">
          <path
            d="m5 12 4 4L19 6"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </div>
      <h1 id="logout-success-title">
        {{ serverLogoutSkipped ? '已退出当前系统' : '已安全退出' }}
      </h1>
      <p v-if="serverLogoutSkipped">
        统一认证会话仍然有效，再次登录时可能无需输入账号密码。
      </p>
      <p v-else>当前系统和统一认证会话均已退出。</p>
      <Button type="primary" size="large" @click="loginAgain">
        重新登录
      </Button>
    </section>
  </main>
</template>

<style scoped>
.logout-success {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 32px 20px;
}

.success-card {
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

.success-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  color: #16a34a;
  background: #f0fdf4;
  border: 7px solid #dcfce7;
  border-radius: 50%;
}

.success-icon svg {
  width: 36px;
  height: 36px;
}

h1 {
  margin: 0 0 14px;
  font-size: 26px;
  font-weight: 650;
  color: hsl(var(--foreground));
  letter-spacing: -0.02em;
}

p {
  margin: 0 0 28px;
  font-size: 15px;
  line-height: 1.6;
  color: hsl(var(--muted-foreground));
}

:deep(.ant-btn) {
  min-width: 140px;
  border-radius: 9px;
}

@media (max-width: 520px) {
  .success-card {
    padding: 34px 24px 28px;
  }

  :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
