<script setup lang="ts">
import { nextTick, ref, unref } from 'vue';

import { type ExtendedModalApi, useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { useSmartTable } from '#/adapter/smart-table';
import { ApiServiceEnum, requestClient } from '#/api/request';
import { setUserRoleApi } from '#/modules/smart-system/views/user/UserListView.api';
import { successMessage } from '#/utils';

const currentUserId = ref<null | number>(null);

const [SmartTable, tableApi] = useSmartTable({
  border: true,
  size: 'small',
  rowConfig: {
    isHover: true,
    keyField: 'roleId',
  },
  stripe: true,
  checkboxConfig: {
    rowTrigger: 'multiple',
    highlight: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ({ ajaxParameter }) => {
        return requestClient.post(
          'sys/role/list',
          {
            sortName: 'seq',
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              'useYn@=': true,
            },
          },
          {
            service: ApiServiceEnum.SMART_SYSTEM,
          },
        );
      },
    },
  },
  // todo:国际化
  columns: [
    {
      type: 'checkbox',
      width: 50,
    },
    {
      title: '#',
      type: 'seq',
      width: 50,
    },
    {
      title: '角色编码',
      field: 'roleCode',
      width: 160,
    },
    {
      title: '角色名称',
      field: 'roleName',
      minWidth: 160,
    },
  ],
});

const setSelectRole = async () => {
  const userId = unref(currentUserId)!;
  const roleList: any[] = await requestClient.post(
    'sys/user/listUserRole',
    { id: userId },
    {
      service: ApiServiceEnum.SMART_SYSTEM,
    },
  );
  const tableInstance = tableApi.getGrid();
  tableInstance.clearCheckboxRow();
  tableInstance.setCheckboxRow(
    roleList.map((item) => ({ roleId: item.roleId })),
    true,
  );
};

const handleSaveUserRole = async (modalApi: ExtendedModalApi) => {
  const tableInstance = tableApi.getGrid();
  const roleIdList = tableInstance
    .getCheckboxRecords()
    .map((item) => item.roleId);
  try {
    modalApi.setState({ confirmLoading: true });
    await setUserRoleApi({
      userId: unref(currentUserId),
      roleIdList,
    });
    successMessage(t('system.views.user.message.setRoleSuccess'));
    modalApi.close();
  } finally {
    modalApi.setState({ confirmLoading: false });
  }
};

const [Modal, modalApi] = useVbenModal({
  onOpened: () => {
    const { userId } = modalApi.getData();
    currentUserId.value = userId;
    nextTick(async () => {
      await tableApi.query();
      await setSelectRole();
    });
  },
  onConfirm: () => {
    handleSaveUserRole(modalApi);
  },
});
</script>

<template>
  <Modal
    :title="t('system.views.user.button.setRole')"
    @ok="handleSaveUserRole"
  >
    <SmartTable />
  </Modal>
</template>

<style scoped></style>
