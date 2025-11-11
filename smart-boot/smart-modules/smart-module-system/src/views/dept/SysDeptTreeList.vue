<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref, unref, useTemplateRef } from 'vue';

import {
  SmartAuthButton,
  SmartIconButton,
  SmartLayoutSeparate,
  SysDeptTree,
  useVbenModal,
} from '@vben/common-ui';
import { useSizeSetting } from '@vben/hooks';
import { $t } from '@vben/locales';

import {
  createConfirm,
  errorMessage,
  successMessage,
} from '@smart/common/utils';
import { TabPane, Tabs } from 'ant-design-vue';

import DeptUserList from './components/DeptUserList.vue';
import SysDeptEdit from './components/SysDeptEdit.vue';
import SysDeptEditModal from './components/SysDeptEditModal.vue';
import { deleteApi, saveUpdateBatchApi } from './SysDept.api';

const treeRef = useTemplateRef<typeof SysDeptTree>('treeRef');
const formRef = useTemplateRef<typeof SysDeptEdit>('formRef');

const { getFormSize, getButtonSize } = useSizeSetting();

const [Modal, modalApi] = useVbenModal({
  connectedComponent: SysDeptEditModal,
  destroyOnClose: false,
});

/**
 * 当前选中节点的code
 */
const currentDeptRef = ref<null | Recordable<any>>(null);
const handleTreeSelect = (
  _: Array<number>,
  { selectedNodes, selected }: any,
) => {
  if (!selected || selectedNodes.length === 0) {
    currentDeptRef.value = null;
  }
  currentDeptRef.value = selectedNodes[0];
};

const reloadDeptTree = () => {
  unref(treeRef)?.reload();
};

/**
 * 保存操作
 */
const saveLoading = ref(false);
const handleSave = async () => {
  const formModel = await unref(formRef)?.validateAndGet();
  try {
    saveLoading.value = true;
    await saveUpdateBatchApi([formModel]);
    successMessage($t('common.message.saveSuccess'));
    await reloadDeptTree();
  } finally {
    saveLoading.value = false;
  }
};

/**
 * 添加操作函数
 */
const handleAdd = () => {
  modalApi.setData({
    parentId: 0,
    parentName: '根',
  });
  modalApi.open();
};

/**
 * 添加下级
 */
const handleAddChild = () => {
  const currentDept = unref(currentDeptRef);
  if (!currentDept) {
    errorMessage($t('system.views.dept.message.selectDeptError'));
    return false;
  }
  const { deptId, deptName } = unref(currentDeptRef) || {};
  modalApi.setData({
    parentId: deptId,
    parentName: deptName,
  });
  modalApi.open();
};

/**
 * 删除hook
 */
const handleDelete = () => {
  const currentDept = unref(currentDeptRef);
  if (!currentDept) {
    errorMessage($t('common.notice.deleteChoose'));
    return false;
  }
  createConfirm({
    title: $t('common.confirm'),
    content: $t('common.message.deleteConfirm'),
    onOk: async () => {
      await deleteApi([currentDept.deptId]);
      successMessage($t('common.message.deleteSuccess'));
      reloadDeptTree();
    },
  });
};
</script>

<template>
  <div class="page-container h-full">
    <SmartLayoutSeparate first-size="300px" draggable class="h-full">
      <template #first>
        <div class="bg-background h-full p-[5px]">
          <div>
            <SmartAuthButton
              :size="getButtonSize as never"
              auth="sys:dept:save"
              pre-icon="ant-design:plus-outlined"
              type="primary"
              @click="handleAdd"
            >
              {{ $t('common.button.add') }}
            </SmartAuthButton>
            <SmartAuthButton
              :size="getButtonSize as never"
              auth="sys:dept:save"
              pre-icon="ant-design:plus-outlined"
              style="margin-left: 5px"
              type="primary"
              @click="handleAddChild"
            >
              {{ $t('system.views.dept.button.addChild') }}
            </SmartAuthButton>
            <SmartAuthButton
              :size="getButtonSize as never"
              auth="sys:dept:delete"
              danger
              pre-icon="ant-design:delete-outlined"
              style="margin-left: 5px"
              type="primary"
              @click="handleDelete"
            >
              {{ $t('common.button.delete') }}
            </SmartAuthButton>
          </div>
          <SysDeptTree
            ref="treeRef"
            show-search
            style="margin-top: 5px"
            @select="handleTreeSelect"
          />
        </div>
      </template>
      <template #second>
        <div class="right-tab bg-background h-full">
          <Tabs class="">
            <TabPane
              class="h-full"
              key="baseMessage"
              :tab="$t('system.views.dept.title.baseMessage')"
            >
              <div class="h-full p-[5px]">
                <SysDeptEdit
                  ref="formRef"
                  class="edit-form-container"
                  :dept-id="currentDeptRef?.deptId"
                  :filter-field="false"
                  :size="getFormSize"
                />
                <div style="text-align: right" class="save-button-container">
                  <SmartIconButton
                    :disabled="
                      currentDeptRef === null || currentDeptRef === undefined
                    "
                    :loading="saveLoading"
                    pre-icon="ant-design:save-outlined"
                    style="margin-right: 10px; text-align: right"
                    type="primary"
                    @click="handleSave"
                  >
                    {{ $t('common.button.save') }}
                  </SmartIconButton>
                </div>
              </div>
            </TabPane>
            <!--     部门用户列表     -->
            <TabPane
              class="h-full"
              key="userList"
              :tab="$t('system.views.dept.title.userList')"
            >
              <DeptUserList :dept-id="currentDeptRef?.deptId" />
            </TabPane>
          </Tabs>
        </div>
      </template>
    </SmartLayoutSeparate>
    <Modal @after-save="reloadDeptTree" />
  </div>
</template>

<style lang="less" scoped>
@leftWidth: 40%;
@buttonHeight: 32px;
.left-tree {
  display: inline-block;
  width: @leftWidth;
  padding: 10px;
}

.right-tab {
  .ant-tabs {
    height: 100%;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
  .save-button-container {
    height: @buttonHeight;
    margin-top: 5px;
  }
  .edit-form-container {
    height: calc(100% - 42px);
    overflow: auto;
  }
  :deep(.ant-tabs-nav-wrap) {
    padding: 0 5px;
  }
  :deep(.ant-tabs-nav) {
    margin-bottom: 10px;
  }
}
</style>
