<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';

import { nextTick, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
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
  columnConfig: {
    resizable: true,
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
  searchFormConfig: {
    compact: true,
    searchWithSymbol: true,
    wrapperClass: 'flex flex-wrap',
    actionWrapperClass: 'text-left',
    commonConfig: {
      labelWidth: 80,
      formItemClass: 'pb-2',
    },
    schema: [
      {
        fieldName: 'roleCode',
        label: t('system.views.role.table.roleCode'),
        component: 'Input',
        searchSymbol: 'like',
      },
      {
        fieldName: 'roleName',
        label: t('system.views.role.table.roleName'),
        component: 'Input',
        searchSymbol: 'like',
      },
    ],
  },
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
      title: t('system.views.role.table.roleCode'),
      field: 'roleCode',
      width: 160,
    },
    {
      title: t('system.views.role.table.roleName'),
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
  class: 'w-[800px]',
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
