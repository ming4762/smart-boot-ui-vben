<script setup lang="ts">
import { computed, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ChangeTenantModal } from '@vben/layouts';
import { $ct as t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { listCurrentUserTenantApi } from '@smart/common/api';
import { useAuthStore } from '@smart/common/store';
import { SmartIconButton } from '@smart/components';
import { List } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import Container from './container.vue';

const ListItem = List.Item;
const ListItemMeta = List.Item.Meta;

const { userInfo } = storeToRefs(useUserStore());

const authStore = useAuthStore();

/**
 * 租户切换
 */
const [RenderChangeTenantModal, changeTenantModalApi] = useVbenModal({
  connectedComponent: ChangeTenantModal,
});
const handleChangeTenant = (tenantId: number) => {
  return authStore.changeTenant(tenantId);
};

const handleAction = (key: string) => {
  if (key === 'tenant') {
    changeTenantModalApi.open();
  }
};

const computedConfigValue = computed<Record<string, any>>(() => {
  return {
    tenant: [
      unref(userInfo)?.userTenant.tenantCode,
      unref(userInfo)?.userTenant?.tenantName,
    ]
      .filter((item) => item !== null)
      .join('/'),
  };
});

const configList = [
  {
    title: t('ui.widgets.personalCenter.systemSetting.tenant'),
    description: t('ui.widgets.personalCenter.systemSetting.tenantDescription'),
    key: 'tenant',
    actionName: t('common.switch'),
  },
];
</script>

<template>
  <Container
    class="system-setting h-full"
    :title="t('ui.widgets.personalCenter.systemSetting.title')"
  >
    <List>
      <template v-for="item in configList" :key="item.key">
        <ListItem>
          <ListItemMeta>
            <template #title>
              {{ item.title }}
              <div
                class="action text-font-normal text-primary float-right mr-[30px] mt-[10px] cursor-pointer"
                v-if="item.actionName"
              >
                <SmartIconButton
                  @click="() => handleAction(item.key)"
                  type="link"
                >
                  {{ item.actionName }}
                </SmartIconButton>
              </div>
            </template>
            <template #description>
              <div>
                {{ item.description }}{{ computedConfigValue[item.key] }}
              </div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
    <!--  租户切换modal  -->
    <RenderChangeTenantModal
      :change-tenant-handler="handleChangeTenant"
      :user-tenant-api="listCurrentUserTenantApi"
    />
  </Container>
</template>

<style scoped></style>
