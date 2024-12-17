<script setup lang="tsx">
import type { UserTenant } from '@vben/types';

import { nextTick, ref, unref } from 'vue';

import { $ct as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';
import { useVbenModal } from '@vben-core/popup-ui';
import { globalShareState } from '@vben-core/shared/global-state';

interface Props {
  userTenantApi?: () => Promise<UserTenant[]>;
  changeTenantHandler?: (tenantId: number) => Promise<void>;
}

const props = defineProps<Props>();

const RadioGroup = globalShareState.getComponents().RadioGroup;
const Radio = globalShareState.getComponents().Radio;

const userStore = useUserStore();

const tenantListRef = ref<UserTenant[]>([]);
const currentTenantIdRef = ref<null | number>(null);

const [Modal, modalApi] = useVbenModal({
  title: t('ui.widgets.changeTenant.title'),
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        currentTenantIdRef.value = userStore.getUserTenant?.tenantId || null;
      });
      try {
        modalApi.setState({ loading: true });
        tenantListRef.value = (await props.userTenantApi?.()) || [];
      } finally {
        modalApi.setState({ loading: false });
      }
    } else {
      tenantListRef.value = [];
    }
  },
  onConfirm: async () => {
    const tenantId = unref(currentTenantIdRef);
    if (tenantId === null) {
      return false;
    }
    if (tenantId === userStore.getUserTenant?.tenantId) {
      modalApi.close();
      return false;
    }
    if (!props.changeTenantHandler) {
      throw new Error('changeTenantHandler is not defined');
    }
    try {
      modalApi.setState({ confirmLoading: true });
      await props.changeTenantHandler?.(tenantId);
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  },
});

const radioStyle = {
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
};
</script>

<template>
  <Modal v-bind="$attrs">
    <div class="container">
      <RadioGroup v-model:value="currentTenantIdRef">
        <Radio
          v-for="item in tenantListRef"
          :key="item.tenantId"
          :style="radioStyle"
          :value="item.tenantId"
        >
          {{ item.tenantCode }}: {{ item.tenantShortName || item.tenantName }}
        </Radio>
      </RadioGroup>
    </div>
  </Modal>
</template>

<style scoped>
.container {
  padding-left: 10px;
}
</style>
