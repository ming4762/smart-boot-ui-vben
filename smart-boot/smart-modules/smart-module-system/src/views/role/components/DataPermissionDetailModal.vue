<script setup lang="ts">
import { nextTick, watch } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t as t } from '@vben/locales';

import { DATA_PERMISSION_SCOPE } from '#/constants/system-constants';

import { getDataPermissionDetailByIdApi } from '../RoleListView.api';

const { getFormSize } = useSizeSetting();

/**
 * TODO:国际化
 */
const [Modal, modalApi] = useVbenModal({
  title: '数据权限详情',
  showCancelButton: false,
  onConfirm: () => modalApi.close(),
  draggable: true,
  onOpenChange: (open) => {
    if (open) {
      nextTick(async () => {
        const { dataPermissionId } = modalApi.getData();
        const detail = await getDataPermissionDetailByIdApi(dataPermissionId);
        formApi.setValues(detail);
      });
    } else {
      formApi.resetForm();
    }
  },
});

const [Form, formApi] = useVbenForm({
  compact: true,
  commonConfig: {
    disabled: true,
  },
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'permissionCode',
      label: t('system.views.dataPermission.title.permissionCode'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'permissionName',
      label: t('system.views.dataPermission.title.permissionName'),
      component: 'Input',
      componentProps: {},
      rules: 'required',
    },
    {
      fieldName: 'scope',
      label: t('system.views.dataPermission.title.scope'),
      component: 'Select',
      controlClass: 'w-full',
      componentProps: {
        options: DATA_PERMISSION_SCOPE,
      },
      rules: 'required',
    },
    {
      fieldName: 'permissionColumn',
      label: t('system.views.dataPermission.title.permissionColumn'),
      component: 'Input',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      fieldName: 'tableName',
      label: t('system.views.dataPermission.title.tableName'),
      component: 'Input',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      fieldName: 'mapperStatementId',
      label: t('system.views.dataPermission.title.mapperStatementId'),
      component: 'Input',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      fieldName: 'permissionValue',
      label: t('system.views.dataPermission.title.permissionValue'),
      component: 'Textarea',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      fieldName: 'remark',
      label: t('common.table.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: ' ',
      },
    },
  ],
});

watch(
  getFormSize,
  (value) => {
    formApi.setState({
      commonConfig: {
        componentProps: {
          size: value,
        },
      },
    });
  },
  { immediate: true },
);
</script>

<template>
  <Modal>
    <Form :size="getFormSize" class="data-permission-form" />
  </Modal>
</template>

<style scoped lang="less">
.data-permission-form {
  :deep(.ant-input),
  :deep(.ant-select-selector) {
    color: black !important;
  }
}
</style>
