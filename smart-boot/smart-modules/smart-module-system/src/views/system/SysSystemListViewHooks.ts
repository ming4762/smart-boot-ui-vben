import type { Recordable } from '@vben/types';

import { h, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { successMessage } from '@smart/common/utils';
import { SmartTableSelectUserModal } from '@smart/components';

import { getRelatedUserIdApi, setUserApi } from './SysSystemListView.api';

export const useSetUser = () => {
  const [Modal, modalApi] = useVbenModal({
    connectedComponent: SmartTableSelectUserModal,
    title: '选择人员',
  });
  const selectUserList = ref<number[]>([]);
  const currentSystemRef = ref<null | Recordable<any>>(null);

  const handleUserSelected = async (userIdList: number[]) => {
    selectUserList.value = userIdList;
    try {
      modalApi.setState({ confirmLoading: true });
      await setUserApi({
        userIdList,
        systemId: unref(currentSystemRef)?.id,
      });
      successMessage(t('common.message.operationSucceeded'));
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  };

  const SelectUserModal = () => {
    return h(Modal, {
      selectValues: unref(selectUserList),
      onSelected: handleUserSelected,
      class: 'w-[700px]',
    });
  };

  const handleShowSetUser = async (row: Recordable<any>) => {
    currentSystemRef.value = row;
    // 查询关联的用户信息
    modalApi.open();
    try {
      modalApi.setState({ loading: true });
      selectUserList.value = await getRelatedUserIdApi(row.id);
    } finally {
      modalApi.setState({ loading: false });
    }
  };

  return {
    handleShowSetUser,
    SelectUserModal,
  };
};
