<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { formatDateTime } from '@vben/utils';

import { errorMessage, successMessage } from '@smart/common/utils';
import { Descriptions, DescriptionsItem, Divider, Tag } from 'ant-design-vue';

import { getByIdApi, saveAccountSettingApi } from '../UserListView.api';
import { getAccountFormSchemas } from '../UserListView.config';

const { hasAccessByAuth } = useAccess();

const userData = ref<Recordable<any>>({});
const accountData = ref<Recordable<any>>({});

/**
 * 是否有编辑权限
 */
const computedHasEditPermission = computed(() =>
  hasAccessByAuth('sys:account:update'),
);

const [VbenForm, formApi] = useVbenForm({
  schema: getAccountFormSchemas(computedHasEditPermission),
  wrapperClass: 'grid grid-cols-2',
  showDefaultActions: false,
  commonConfig: {
    formItemClass: 'pb-2',
  },
});

const handleSave = async (modalApi: ExtendedModalApi) => {
  await formApi.validate();
  const data = await formApi.getValues();
  try {
    modalApi.setState({ confirmLoading: true });
    await saveAccountSettingApi(data);
    successMessage($t('common.message.operationSucceeded'));
    modalApi.close();
  } finally {
    modalApi.setState({ confirmLoading: false });
  }
};

const [Modal, modalApi] = useVbenModal({
  title: $t('system.views.user.account.title'),
  class: 'w-[1200px]',
  onConfirm: () => handleSave(modalApi),
  onClosed: () => {
    userData.value = {};
    accountData.value = {};
  },
  onOpened: async () => {
    const user = modalApi.getData();
    modalApi.setState({ loading: true });
    try {
      const result = await getByIdApi(user.userId);
      userData.value = result;
      if (result.userAccount) {
        accountData.value = result.userAccount;
        formApi.setValues({
          ...result.userAccount,
        });
      } else {
        errorMessage($t('system.views.user.message.noAccount'));
      }
    } finally {
      modalApi.setState({ loading: false });
    }
  },
});
</script>

<template>
  <Modal clas="w-[1200px]">
    <Descriptions :title="$t('system.views.user.account.title')" bordered>
      <DescriptionsItem
        :label="$t('system.views.user.table.username')"
        class="w-[135px]"
      >
        <div class="w-[140px]">
          {{ userData.username }}
        </div>
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('system.views.user.table.fullName')"
        class="w-[135px]"
      >
        <div class="w-[140px]">
          {{ userData.fullName }}
        </div>
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.table.userType')">
        {{ userData.userType }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.user.table.mobile')">
        {{ userData.mobile }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.table.email')" :span="2">
        {{ userData.email }}
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.user.account.createTime')">
        {{ formatDateTime(accountData.createTime) }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.account.accountStatus')">
        {{ accountData.accountStatus }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('system.views.user.account.initialPasswordYn')"
      >
        <Tag v-if="accountData.initialPasswordYn" color="#f50">
          {{ $t('common.title.yes') }}
        </Tag>
        <Tag v-else color="#108ee9">{{ $t('common.title.no') }}</Tag>
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.user.account.loginFailTime')">
        {{ accountData.loginFailTime }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.account.lockTime')">
        {{ formatDateTime(accountData.lockTime) }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('system.views.user.account.passwordModifyTime')"
      >
        {{ formatDateTime(accountData.passwordModifyTime) }}
      </DescriptionsItem>
    </Descriptions>
    <Divider />
    <section class="account-setting">
      <div class="title">{{ $t('system.views.user.account.accountSet') }}</div>
      <VbenForm />
    </section>
  </Modal>
</template>

<style scoped lang="less">
.account-setting {
  .title {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
