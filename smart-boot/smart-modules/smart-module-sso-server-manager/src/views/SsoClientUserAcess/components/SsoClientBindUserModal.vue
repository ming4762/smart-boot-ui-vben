<script setup lang="ts">
import { ref, unref } from 'vue';

import { useSmartTable, useVbenForm, useVbenModal } from '@vben/common-ui';
import { $ct as t } from '@vben/locales';

import { successMessage, warnMessage } from '@smart/common/utils';

import { bindUserApi, listUnBindUserApi } from '../SsoClientUserAcess.api';
import {
  getBindModelFormSchema,
  getBindModelUserTableColumns,
} from '../SsoClientUserAcess.config';

const emit = defineEmits(['bindSuccess']);

const clientIdRef = ref<null | number>(null);

const clientTypeAccessStrategyMap: any = {
  PUBLIC: 'DENY',
  PRIVATE: 'ALLOW',
};

const [Modal, modalApi] = useVbenModal({
  title: '绑定用户',
  draggable: true,
  onOpened() {
    const { clientId, clientType } = modalApi.getData();
    clientIdRef.value = clientId;
    formApi.setFieldValue(
      'accessStrategy',
      clientTypeAccessStrategyMap[clientType],
    );
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
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    try {
      await bindUserApi({
        clientId: unref(clientIdRef),
        userIdList: userIds,
        ...(await formApi.getValues()),
      });
      successMessage(t('common.message.operationSucceeded'));
      modalApi.close();
      emit('bindSuccess');
    } finally {
      modalApi.setState({ confirmLoading: false });
    }
  },
});

const [Form, formApi] = useVbenForm({
  schema: getBindModelFormSchema(),
  // layout: 'inline',
  wrapperClass: 'grid-cols-2',
  commonConfig: {
    colon: true,
    componentProps: {
      size: 'small',
    },
  },
  showDefaultActions: false,
  compact: true,
});

const [Table, tableApi] = useSmartTable({
  columns: getBindModelUserTableColumns(),
  height: 'auto',
  stripe: true,
  border: true,
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
        const clientId = unref(clientIdRef);
        if (!clientId) {
          return { rows: [] };
        }
        return await listUnBindUserApi({
          ...ajaxParameter,
          id: clientId,
        });
      },
    },
  },
});
</script>

<template>
  <Modal class="h-[600px] w-[950px]">
    <Form />
    <div class="split"></div>
    <div class="table-container">
      <Table />
    </div>
  </Modal>
</template>

<style scoped>
.split {
  height: 3px;
  background: hsl(var(--background-deep));
}

.table-container {
  height: calc(100% - 38px);
}
</style>
