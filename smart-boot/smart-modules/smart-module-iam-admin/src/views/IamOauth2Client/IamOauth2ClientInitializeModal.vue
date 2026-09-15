<script setup lang="ts">
import type { ExtendedModalApi } from '@vben/common-ui';

import { ref } from 'vue';

import { useSmartTable, useVbenModal } from '@vben/common-ui';

import { Modal as AntModal, message } from 'antdv-next';

import {
  getInitializationStatusApi,
  initializeClientApi,
  listTenantApi,
} from './IamOauth2ClientListView.api';

interface ClientRow {
  clientName: string;
  id: number | string;
}

let client: ClientRow | null = null;
const subscribedTenantIds = ref(new Set<string>());

const [SmartTable, tableApi] = useSmartTable({
  border: true,
  height: 420,
  rowConfig: {
    isHover: true,
    keyField: 'id',
  },
  checkboxConfig: {
    reserve: true,
  },
  useSearchForm: false,
  columns: [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      field: 'checkbox',
    },
    {
      field: 'tenantCode',
      title: '租户编码',
      minWidth: 140,
    },
    {
      field: 'tenantName',
      title: '租户名称',
      minWidth: 180,
    },
  ],
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ({ ajaxParameter }) => listTenantApi(ajaxParameter),
    },
  },
  showOverflow: 'tooltip',
});

/** 数据加载后恢复默认套餐原有订阅租户的勾选状态。 */
const restoreTenantSelection = () => {
  const grid = tableApi.getGrid();
  const rows = grid.getData().filter((row: Record<string, any>) =>
    subscribedTenantIds.value.has(String(row.id)),
  );
  grid.setCheckboxRow(rows, true);
};

/** 汇总当前页和翻页保留的租户选择，避免分页时遗漏已勾选项。 */
const getSelectedTenantIds = (): Array<number | string> => {
  const grid = tableApi.getGrid();
  const rows = [
    ...(grid.getCheckboxRecords() || []),
    ...(grid.getCheckboxReserveRecords() || []),
  ];
  return [...new Set(rows.map((item: Record<string, any>) => item.id))];
};

/** 在覆盖已初始化客户端前展示包含实际影响范围的二次确认。 */
const confirmOverwrite = () =>
  new Promise<boolean>((resolve) => {
    AntModal.confirm({
      title: '客户端已经初始化，是否重新初始化？',
      content:
        '重新初始化将重建客户端菜单，并覆盖默认套餐、已有及新选租户的套餐订阅和默认角色授权。人工创建的角色和套餐不会删除，但其旧菜单授权会被清理。',
      okText: '重新初始化',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });

/** 校验租户选择，完成必要的覆盖确认后提交初始化请求。 */
const handleConfirm = async (modalApi: ExtendedModalApi) => {
  if (!client) return false;
  const tenantIds = getSelectedTenantIds();
  if (tenantIds.length === 0) {
    message.warning('请至少选择一个租户');
    return false;
  }
  try {
    modalApi.setState({ confirmLoading: true });
    // 提交前再次检查，防止弹窗打开后其他请求完成初始化而绕过覆盖确认。
    const latestStatus = await getInitializationStatusApi(client.id);
    const overwrite = latestStatus.initialized;
    if (overwrite && !(await confirmOverwrite())) {
      return false;
    }
    await initializeClientApi({
      clientId: client.id,
      tenantIds,
      overwrite,
    });
    message.success(overwrite ? '客户端重新初始化成功' : '客户端初始化成功');
    modalApi.close();
  } finally {
    modalApi.setState({ confirmLoading: false });
  }
};

const [Modal, modalApi] = useVbenModal<ClientRow>({
  title: '初始化客户端',
  onOpened: async () => {
    const currentClient = modalApi.getData();
    if (!currentClient) {
      message.error('未获取到客户端信息');
      modalApi.close();
      return;
    }
    client = currentClient;
    const grid = tableApi.getGrid();
    grid.clearCheckboxRow();
    grid.clearCheckboxReserve();
    const status = await getInitializationStatusApi(currentClient.id);
    subscribedTenantIds.value = new Set(
      (status.subscribedTenantIds || []).map(String),
    );
    await tableApi.query();
  },
  onConfirm: () => {
    handleConfirm(modalApi)
  },
});
</script>

<template>
  <Modal>
    <div class="mb-3 text-sm text-gray-500">
      请选择需要初始化默认套餐订阅和默认管理员角色的租户。默认角色将获得该客户端的全部功能权限。
    </div>
    <SmartTable @proxy-query="restoreTenantSelection" />
  </Modal>
</template>
