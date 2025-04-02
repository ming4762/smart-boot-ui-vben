import type { Recordable } from '@vben/types';

import { h, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { SmartTableSelectUserModal } from '#/components';

export const useRoleSetUser = (
  listUserApi: ((parameter: any) => Promise<any>) | undefined,
  listUserByRoleIdApi: (roleIds: number[]) => Promise<any[]>,
  setRoleUserApi: (roleId: number, userIdList: number[]) => Promise<any>,
) => {
  const [Modal, modalApi] = useVbenModal({
    connectedComponent: SmartTableSelectUserModal,
    title: $t('system.views.role.button.setRoleUser'),
  });
  const currentRole = ref<null | Recordable<any>>(null);
  const selectUserList = ref<number[]>([]);

  const handleShowSetUser = async (role: Recordable<any>) => {
    currentRole.value = role;
    modalApi.open();
    try {
      modalApi.setState({ loading: true });
      const result = await listUserByRoleIdApi([role.roleId]);
      selectUserList.value = result.map((item: any) => item.userId);
    } finally {
      modalApi.setState({ loading: false });
    }
  };

  const handleSetUser = async (userId: number[]) => {
    selectUserList.value = userId;
    try {
      modalApi.setState({ confirmLoading: true });
      await setRoleUserApi(unref(currentRole)?.roleId, userId);
      message.success($t('common.message.operationSucceeded'));
      modalApi.close();
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  };

  const SelectUserModal = () => {
    return h(Modal, {
      showSelect: true,
      class: 'w-[1200px]',
      onSelected: handleSetUser,
      listUserApi,
      selectValues: unref(selectUserList),
    });
  };

  return {
    handleShowSetUser,
    SelectUserModal,
  };
};
