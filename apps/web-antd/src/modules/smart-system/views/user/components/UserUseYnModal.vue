<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { type ExtendedModalApi, useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import { useSmartTable } from '#/adapter/smart-table';
import { successMessage, warnMessage } from '#/utils';

import { listTenantApi, setUseYnApi } from '../UserListView.api';

let selectRows: Recordable<any>[] = [];
let useYnValue = null;

const [SmartTable, tableApi] = useSmartTable({
  border: true,
  stripe: true,
  rowConfig: {
    isHover: true,
  },
  columnConfig: {
    resizable: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query() {
        return listTenantApi({});
      },
    },
  },
  showOverflow: 'tooltip',
  columns: [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'tenantCode',
      title: '{system.views.tenant.manager.title.tenantCode}',
      minWidth: 120,
    },
    {
      field: 'tenantShortName',
      title: '{system.views.tenant.manager.title.tenantShortName}',
      minWidth: 120,
    },
    {
      field: 'tenantName',
      title: '{system.views.tenant.manager.title.tenantName}',
      minWidth: 120,
    },
  ],
});

const handleOk = async (modalApi: ExtendedModalApi) => {
  const selectTenants = tableApi.getGrid().getCheckboxRecords();
  if (selectTenants.length === 0) {
    warnMessage(t('common.notice.select'));
    return false;
  }
  try {
    modalApi.setState({ confirmLoading: true });
    await setUseYnApi(selectRows, useYnValue!, {
      tenantIdList: selectTenants.map((item) => item.id),
    });
    successMessage(t('common.message.operationSucceeded'));
    modalApi.close();
  } finally {
    modalApi.setState({ confirmLoading: false });
  }
};

const [Modal, modalApi] = useVbenModal({
  onOpened: () => {
    const { rows, useYn } = modalApi.getData();
    // 打开时的操作
    selectRows = rows || [];
    useYnValue = useYn;
    tableApi.query();
  },
  onConfirm: () => handleOk(modalApi),
  title: t('common.title.useYn'),
});
</script>

<template>
  <Modal>
    <SmartTable />
  </Modal>
</template>

<style scoped></style>
