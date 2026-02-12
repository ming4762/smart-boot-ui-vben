<script setup lang="ts">
import type { DescriptionsItemType } from 'antdv-next';

import type { ExtendedModalApi } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref, unref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { formatDateTime } from '@vben/utils';

import { errorMessage, successMessage } from '@smart/common/utils';
import { Descriptions, Divider, Tag } from 'antdv-next';

import { getByIdApi, saveAccountSettingApi } from '../UserListView.api';
import { getAccountFormSchemas } from '../UserListView.config';

const { hasAccessByAuth } = useAccess();

const userDataRef = ref<Recordable<any>>({});
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
    userDataRef.value = {};
    accountData.value = {};
  },
  onOpened: async () => {
    const user = modalApi.getData();
    modalApi.setState({ loading: true });
    try {
      const result = await getByIdApi(user.userId);
      userDataRef.value = result;
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

const computedItems = computed<DescriptionsItemType[]>(() => {
  const userData = unref(userDataRef);
  return [
    {
      label: $t('system.views.user.table.username'),
      content: userData.username,
    },
    {
      label: $t('system.views.user.table.fullName'),
      content: userData.fullName,
    },
    {
      label: $t('system.views.user.table.userType'),
      content: userData.userType,
    },
    {
      label: $t('system.views.user.table.mobile'),
      content: userData.mobile,
    },
    {
      label: $t('system.views.user.table.email'),
      content: userData.email,
      span: 2,
    },
    {
      label: $t('system.views.user.account.createTime'),
      content: formatDateTime(userData.createTime),
    },
    {
      label: $t('system.views.user.account.accountStatus'),
      content: accountData.value.accountStatus,
    },
    {
      label: $t('system.views.user.account.initialPasswordYn'),
      content: accountData.value.initialPasswordYn,
    },
    {
      label: $t('system.views.user.account.loginFailTime'),
      content: accountData.value.loginFailTime,
    },
    {
      label: $t('system.views.user.account.lockTime'),
      content: formatDateTime(accountData.value.lockTime),
    },
    {
      label: $t('system.views.user.account.passwordModifyTime'),
      content: formatDateTime(accountData.value.passwordModifyTime),
    },
  ];
});
</script>

<template>
  <Modal clas="w-[1200px]">
    <Descriptions
      class="user-account-descriptions"
      :title="$t('system.views.user.account.title')"
      :items="computedItems"
      bordered
    >
      <template #contentRender="{ index, item }">
        <template v-if="index === 7">
          <Tag variant="solid" v-if="item.content" color="#f50">
            {{ $t('common.title.yes') }}
          </Tag>
          <Tag variant="solid" v-else color="#108ee9">
            {{ $t('common.title.no') }}
          </Tag>
        </template>
      </template>
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
.user-account-descriptions {
  :deep(.ant-descriptions-item-label) {
    width: 150px;
  }
}
</style>
