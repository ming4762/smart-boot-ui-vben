<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { Button, Card, message } from 'antdv-next';

defineOptions({ name: 'SSOConsent' });

const route = useRoute();

const clientName = ref('');
const scopes = ref<string[]>([]);
const loading = ref(false);

onMounted(async () => {
  const clientId = route.query.client_id as string;
  if (!clientId) {
    message.error('缺少 client_id 参数');
    return;
  }
  try {
    const res = await requestClient.get(`/auth/sso/consent/info`, {
      params: { client_id: clientId },
      service: ApiServiceEnum.SMART_AUTH,
    });
    clientName.value = res.clientName || clientId;
    scopes.value = res.scopes || [];
  } catch {
    message.error('获取客户端信息失败');
  }
});

const handleApprove = async () => {
  loading.value = true;
  try {
    const clientId = route.query.client_id as string;
    const redirectUri = route.query.redirect_uri as string;
    const res = await requestClient.post('/auth/sso/consent/approve', null, {
      params: {
        client_id: clientId,
        redirect_uri: redirectUri,
      },
      service: ApiServiceEnum.SMART_AUTH,
    });
    window.location.href = res;
  } catch {
    message.error('授权失败');
  } finally {
    loading.value = false;
  }
};

const handleDeny = async () => {
  try {
    const clientId = route.query.client_id as string;
    const redirectUri = route.query.redirect_uri as string;
    const res = await requestClient.post('/auth/sso/consent/deny', null, {
      params: { client_id: clientId, redirect_uri: redirectUri },
      service: ApiServiceEnum.SMART_AUTH,
    });
    window.location.href = res;
  } catch {
    message.error('操作失败');
  }
};
</script>

<template>
  <div class="consent-page">
    <Card title="授权确认" style="max-width: 500px; margin: 80px auto">
      <p>
        <strong>{{ clientName }}</strong> 请求访问你的账号
      </p>
      <div v-if="scopes.length > 0">
        <h4>请求的权限：</h4>
        <ul>
          <li v-for="scope in scopes" :key="scope">{{ scope }}</li>
        </ul>
      </div>
      <div
        style="
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        "
      >
        <Button @click="handleDeny">拒绝</Button>
        <Button type="primary" :loading="loading" @click="handleApprove">
          同意
        </Button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.consent-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;
}
</style>
