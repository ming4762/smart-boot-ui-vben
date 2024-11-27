import type { Recordable } from '@vben/types';

import { ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { SmartTableSelectUserModal } from '#/components';

import { listUserIdByGroupIdApi, setUserApi } from '../UserGroupListView.api';

/**
 * 设置用户组人员信息
 */
export const useSetUser = (t: (code: string) => string) => {
  const [SelectUserModal, modalApi] = useVbenModal({
    connectedComponent: SmartTableSelectUserModal,
    title: t('system.views.userGroup.button.setUser'),
  });

  const currentUserGroup = ref<null | Recordable<any>>(null);
  const selectUserList = ref<number[]>([]);

  /**
   * 显示设置用户弹窗
   * @param userGroup
   */
  const handleShowSetUser = async (userGroup: Recordable<any>) => {
    currentUserGroup.value = userGroup;
    modalApi.open();
    try {
      modalApi.setState({ loading: true });
      // 获取已关联的用户信息
      selectUserList.value = await listUserIdByGroupIdApi(userGroup.groupId);
    } finally {
      modalApi.setState({ loading: false });
    }
  };

  /**
   * 设置用户
   * @param userIdList
   */
  const handleUserSelected = async (userIdList: number[]) => {
    selectUserList.value = userIdList;
    try {
      modalApi.setState({ confirmLoading: true });
      await setUserApi(unref(currentUserGroup)?.groupId, userIdList);
      message.success(t('common.message.operationSucceeded'));
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  };

  return {
    SelectUserModal,
    handleShowSetUser,
    handleUserSelected,
    selectUserList,
  };
};
