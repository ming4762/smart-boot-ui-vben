<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { useAccess } from '@vben/access';
import { type ExtendedModalApi, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Descriptions, DescriptionsItem, Divider } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { errorMessage, successMessage } from '#/utils';

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
});

const handleSave = async (modalApi: ExtendedModalApi) => {
  const data = await formApi.validate();
  try {
    modalApi.setState({ confirmLoading: true });
    await saveAccountSettingApi(data);
    successMessage($t('common.message.OperationSucceeded'));
    modalApi.close();
  } finally {
    modalApi.setState({ confirmLoading: true });
  }
};

const [Modal, modalApi] = useVbenModal({
  title: $t('system.views.user.account.title'),
  onConfirm: () => handleSave(modalApi),
  onOpened: async () => {
    userData.value = {};
    accountData.value = {};
    const user = modalApi.getData();
    modalApi.setState({ loading: true });
    try {
      const result = await getByIdApi(user.userId);
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
      <DescriptionsItem :label="$t('system.views.user.table.username')">
        {{ userData.username }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.table.fullName')">
        {{ userData.fullName }}
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
        {{ accountData.createTime }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.account.accountStatus')">
        {{ accountData.accountStatus }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('system.views.user.account.initialPasswordYn')"
      >
        <ATag v-if="accountData.initialPasswordYn" color="#f50">
          {{ $t('common.form.yes') }}
        </ATag>
        <ATag v-else color="#108ee9">{{ $t('common.form.no') }}</ATag>
      </DescriptionsItem>

      <DescriptionsItem :label="$t('system.views.user.account.loginFailTime')">
        {{ accountData.loginFailTime }}
      </DescriptionsItem>
      <DescriptionsItem :label="$t('system.views.user.account.lockTime')">
        {{ accountData.lockTime }}
      </DescriptionsItem>
      <DescriptionsItem
        :label="$t('system.views.user.account.passwordModifyTime')"
      >
        {{ accountData.passwordModifyTime }}
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
