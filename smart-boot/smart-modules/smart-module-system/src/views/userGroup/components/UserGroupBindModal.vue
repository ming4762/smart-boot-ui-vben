<script setup lang="ts">
import { ref, unref } from 'vue';

import { useSmartTable, useVbenModal } from '@vben/common-ui';
import { $ct as t } from '@vben/locales';

import { successMessage, warnMessage } from '@smart/common/utils';

import { listNoBindUserApi, setUserApi } from '../UserGroupListView.api';
import { getUserGroupUserColumns } from '../UserGroupListView.config';

const emit = defineEmits(['operationSuccess']);

const groupIdRef = ref<number | string>();

const [Modal, modalApi] = useVbenModal({
  title: '绑定用户',
  draggable: true,
  onOpened() {
    const { groupId } = modalApi.getData();
    groupIdRef.value = groupId;
    tableApi.query();
  },
  async onConfirm() {
    const selectedRows = tableApi.getGrid().getCheckboxRecords();
    if (selectedRows.length === 0) {
      warnMessage('请选择要绑定的用户');
      return;
    }
    const userIds = selectedRows.map((item) => item.userId);
    modalApi.setState({ confirmLoading: true });
    try {
      await setUserApi(unref(groupIdRef) as number, userIds);
      successMessage(t('common.message.operationSucceeded'));
      modalApi.close();
      emit('operationSuccess');
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  },
});

const [SmartTable, tableApi] = useSmartTable({
  id: 'sys_user_group_user_bind_list',
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
  pagerConfig: true,
  checkboxConfig: {
    rowTrigger: 'multiple',
    highlight: true,
  },
  useSearchForm: true,
  searchFormConfig: {
    layout: 'inline',
    compact: true,
    separator: false,
    searchWithSymbol: true,
    actionWrapperClass: 'gap-1',
    commonConfig: {
      labelWidth: 70,
    },
    schema: [
      {
        fieldName: 'username',
        label: '用户名',
        searchSymbol: 'like',
        component: 'Input',
      },
      {
        fieldName: 'fullName',
        label: '姓名',
        searchSymbol: 'like',
        component: 'Input',
      },
    ],
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      async query({ ajaxParameter }) {
        const groupId = unref(groupIdRef);
        if (!groupId) {
          return { rows: [] };
        }
        return await listNoBindUserApi({
          ...ajaxParameter,
          id: groupId,
        });
      },
    },
  },
});
</script>

<template>
  <Modal class="h-[600px] w-[950px]">
    <SmartTable />
  </Modal>
</template>

<style scoped></style>
