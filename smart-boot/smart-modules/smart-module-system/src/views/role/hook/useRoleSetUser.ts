import type { Recordable } from '@vben/types';

import { h, onBeforeUnmount, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { SmartTableSelectUserModal } from '@smart/components';
import { message } from 'antdv-next';

/** 角色用户选择弹窗；异步加载和提交始终绑定打开弹窗时的角色。 */
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
  let requestVersion = 0;
  let ready = false;
  onBeforeUnmount(() => {
    requestVersion++;
    ready = false;
    modalApi.close();
  });

  /** 清空旧选择，加载完成前禁止把空列表提交为清空授权。 */
  const handleShowSetUser = async (role: Recordable<any>) => {
    const version = ++requestVersion;
    ready = false;
    selectUserList.value = [];
    currentRole.value = role;
    modalApi.open();
    try {
      modalApi.setState({ loading: true });
      const result = await listUserByRoleIdApi([role.roleId]);
      if (version !== requestVersion) return;
      selectUserList.value = result.map((item: any) => item.userId);
      ready = true;
    } catch {
      if (version === requestVersion) modalApi.close();
    } finally {
      if (version === requestVersion) modalApi.setState({ loading: false });
    }
  };

  const handleSetUser = async (userId: number[]) => {
    if (!ready || !currentRole.value) return;
    const version = requestVersion;
    const roleId = currentRole.value.roleId;
    selectUserList.value = userId;
    try {
      modalApi.setState({ confirmLoading: true });
      await setRoleUserApi(roleId, userId);
      if (version !== requestVersion) return;
      message.success($t('common.message.operationSucceeded'));
      modalApi.close();
    } finally {
      if (version === requestVersion) modalApi.setState({ confirmLoading: false });
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
