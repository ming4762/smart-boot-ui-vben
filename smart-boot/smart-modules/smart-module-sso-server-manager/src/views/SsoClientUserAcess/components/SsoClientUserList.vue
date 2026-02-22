<script setup lang="ts">
import { useSmartTable, useVbenModal } from '@vben/common-ui';
import { $ct as t } from '@vben/locales';

import {
  createConfirm,
  successMessage,
  warnMessage,
} from '@smart/common/utils';

import {
  listClientUserApi,
  setBindUserUseYnApi,
  unBindUserApi,
} from '../SsoClientUserAcess.api';
import {
  getClientUserSearchFormSchema,
  getUserTableColumns,
} from '../SsoClientUserAcess.config';
import SsoClientBindUserModal from './SsoClientBindUserModal.vue';

interface Props {
  clientId?: number | string;
  clientType?: string;
}
const props = defineProps<Props>();

const [RenderSsoClientBindUserModal, bindUserModalApi] = useVbenModal({
  connectedComponent: SsoClientBindUserModal,
});

const [SmartTable, tableApi] = useSmartTable({
  id: 'sso_client_user_access_user_list',
  columns: getUserTableColumns(),
  height: 'auto',
  stripe: true,
  showOverflow: 'tooltip',
  rowConfig: {
    isHover: true,
    isCurrent: true,
  },
  customConfig: { storage: true },
  pagerConfig: true,
  checkboxConfig: true,
  useSearchForm: true,
  border: true,
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'seq',
      order: 'asc',
    },
  },
  searchFormConfig: {
    layout: 'inline',
    actionWrapperClass: 'gap-1',
    compact: true,
    schema: getClientUserSearchFormSchema(),
    commonConfig: {
      componentProps: {
        style: {
          maxWidth: '150px',
        },
      },
      labelWidth: 70,
      formItemClass: 'pb-2',
    },
    searchWithSymbol: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ ajaxParameter }) => {
        if (!props.clientId) {
          return {
            rows: [],
          };
        }
        return listClientUserApi({
          ...ajaxParameter,
          clientId: props.clientId,
        });
      },
      useYn(rows: any[], useYn: boolean): Promise<any> {
        const userIdList = rows.map((item) => item.user.userId);
        return setBindUserUseYnApi({
          userIdList,
          useYn,
          clientId: props.clientId,
        });
      },
    },
  },
  columnConfig: {
    resizable: true,
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
    sizeSetting: true,
    showSearch: true,
    buttons: [
      {
        name: '绑定',
        customRender: 'ant',
        props: {
          type: 'primary',
          preIcon: 'ant-design:plus-outlined',
          onClick: () => handleBindUser(),
        },
      },
      {
        name: '移除',
        customRender: 'ant',
        props: {
          type: 'primary',
          danger: true,
          preIcon: 'ant-design:delete-outlined',
          onClick: () => handleRemoveUser(),
        },
      },
      {
        code: 'useYnTrue',
      },
      {
        code: 'useYnFalse',
      },
    ],
  },
});

const handleBindUser = () => {
  if (!props.clientId) {
    warnMessage('请先选择要绑定的客户端');
    return;
  }
  bindUserModalApi.setData({
    clientId: props.clientId,
    clientType: props.clientType,
  });
  bindUserModalApi.open();
};

const handleRemoveUser = () => {
  const selectedRows = tableApi.getGrid().getCheckboxRecords();
  if (selectedRows.length === 0) {
    warnMessage('请先选择要移除的用户');
    return;
  }
  const userIdList = selectedRows.map((item) => item.user.userId);
  createConfirm({
    title: '确认移除选中用户吗？',
    onOk: async () => {
      await unBindUserApi({
        userIdList,
        clientId: props.clientId,
      });
      successMessage(t('common.message.operationSucceeded'));
      tableApi.query();
    },
  });
};
</script>

<template>
  <div class="client-user-container h-full">
    <SmartTable />
    <RenderSsoClientBindUserModal @bind-success="() => tableApi.query()" />
  </div>
</template>

<style scoped lang="less">
.client-user-container {
  :deep(.vxe-grid--layout-body-wrapper) {
    margin: 0 5px;
  }
}
</style>
