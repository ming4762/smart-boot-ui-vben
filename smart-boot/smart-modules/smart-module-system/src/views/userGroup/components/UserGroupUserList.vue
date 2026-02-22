<script setup lang="ts">
import { onMounted, watch } from 'vue';

import { useSmartTable, useVbenModal } from '@vben/common-ui';

import {
  createConfirm,
  successMessage,
  warnMessage,
} from '@smart/common/utils';

import { listUserByIdApi, unBindUserApi } from '../UserGroupListView.api';
import { getUserGroupUserColumns } from '../UserGroupListView.config';
import UserGroupBindModal from './UserGroupBindModal.vue';

interface Props {
  groupId?: number | string;
}
const props = defineProps<Props>();

onMounted(() => tableApi.query());
watch(
  () => props.groupId,
  () => tableApi.query(),
);

const [RenderUserGroupBindModal, bindUserModalApi] = useVbenModal({
  connectedComponent: UserGroupBindModal,
});

const [SmartTable, tableApi] = useSmartTable({
  id: 'sys_user_group_user_list',
  border: true,
  columns: getUserGroupUserColumns(),
  height: 'auto',
  stripe: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'userId',
  },
  showOverflow: 'tooltip',
  customConfig: { storage: true },
  // pagerConfig: true,
  checkboxConfig: true,
  useSearchForm: false,
  proxyConfig: {
    ajax: {
      async query() {
        const groupId = props.groupId;
        if (!groupId) {
          return [];
        }
        return await listUserByIdApi(groupId);
      },
    },
  },
  toolbarConfig: {
    buttons: [
      {
        name: '绑定用户',
        customRender: 'ant',
        props: {
          preIcon: 'ant-design:plus-outlined',
          type: 'primary',
          onClick: () => handleBindUser(),
        },
      },
      {
        name: '移除用户',
        customRender: 'ant',
        props: {
          preIcon: 'ant-design:delete-outlined',
          // type: 'primary',
          color: 'danger',
          variant: 'solid',
          onClick: () => handleRemoveUser(),
        },
      },
    ],
  },
});

/**
 * 绑定用户
 */
const handleBindUser = () => {
  if (!props.groupId) {
    warnMessage('请先选择用户组');
    return;
  }
  bindUserModalApi.setData({
    groupId: props.groupId,
  });
  bindUserModalApi.open();
};

const handleRemoveUser = () => {
  const records = tableApi.getGrid().getCheckboxRecords();
  if (records.length === 0) {
    warnMessage('请选择要移除的用户');
    return;
  }
  createConfirm({
    title: '确认移除选中用户吗？',
    onOk: async () => {
      const groupId = props.groupId;
      if (!groupId) {
        warnMessage('请先选择用户组');
        return;
      }
      const userIdList = records.map((item) => item.userId);
      await unBindUserApi(groupId, userIdList);
      successMessage('移除成功');
      tableApi.query();
    },
  });
};

const handleBindUserSuccess = () => {
  tableApi.query();
};
</script>

<template>
  <div class="h-full">
    <SmartTable />
    <RenderUserGroupBindModal @operation-success="handleBindUserSuccess" />
  </div>
</template>

<style scoped></style>
