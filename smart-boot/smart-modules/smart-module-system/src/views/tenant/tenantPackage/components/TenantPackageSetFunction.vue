<script setup lang="ts">
import type { TreeNode } from '@vben/utils';

import { onMounted, ref, unref, watch } from 'vue';

import { $t as t } from '@vben/locales';
import { listToTree } from '@vben/utils';

import { errorMessage, successMessage } from '@smart/common/utils';
import { SmartIconButton } from '@smart/components';
import {
  Divider,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  Spin,
  Tree,
} from 'antdv-next';

import {
  listFunctionApi,
  listFunctionIdApi,
  savePackageFunctionApi,
} from '../SysTenantPackageListView.api';

interface Props {
  tenantPackageId?: number;
}

const props = defineProps<Props>();

const dataLoading = ref(false);
const saveLoading = ref(false);

interface FunctionTreeNode extends TreeNode {
  children?: FunctionTreeNode[];
  key: number;
  parentId: number;
  title: string;
}

const functionTreeData = ref<FunctionTreeNode[]>([]);
const checkedKeysModel = ref<number[]>([]);

const resolveCheckedKeys = () => {
  const selectedKeys = new Set(unref(checkedKeysModel));
  const checkedKeys: number[] = [];
  const halfCheckedKeys: number[] = [];

  const markChecked = (node: FunctionTreeNode) => {
    checkedKeys.push(node.key);
    node.children?.forEach(markChecked);
  };

  const resolveNode = (node: FunctionTreeNode): 0 | 1 | 2 => {
    if (selectedKeys.has(node.key)) {
      markChecked(node);
      return 2;
    }
    if (!node.children?.length) {
      return 0;
    }

    const childStates = node.children.map(resolveNode);
    if (childStates.every((state) => state === 2)) {
      checkedKeys.push(node.key);
      return 2;
    }
    if (childStates.some((state) => state !== 0)) {
      halfCheckedKeys.push(node.key);
      return 1;
    }
    return 0;
  };

  unref(functionTreeData).forEach((item) => resolveNode(item));

  return {
    checkedKeys: [...new Set(checkedKeys)],
    halfCheckedKeys,
  };
};

const loadFunctionTreeData = async () => {
  dataLoading.value = true;
  try {
    const functionList = await listFunctionApi({
      sortName: 'seq',
    });
    functionTreeData.value =
      listToTree(
        functionList.map(({ functionId, functionName, parentId }: any) => {
          return {
            key: functionId,
            title: functionName,
            parentId,
          };
        }),
        (item) => item.key,
        (item) => item.parentId,
        0,
      ) || [];
  } finally {
    dataLoading.value = false;
  }
};

const loadPackageFunctionIds = async () => {
  const tenantPackageId = props.tenantPackageId;
  if (tenantPackageId) {
    dataLoading.value = true;
    try {
      checkedKeysModel.value = await listFunctionIdApi(tenantPackageId);
    } finally {
      dataLoading.value = false;
    }
  } else {
    checkedKeysModel.value = [];
  }
};

/**
 * 保存操作
 */
const handleSave = async () => {
  const tenantPackageId = props.tenantPackageId;
  if (!tenantPackageId) {
    errorMessage(t('system.views.tenant.package.message.chosePackage'));
    return false;
  }
  saveLoading.value = true;
  try {
    const { checkedKeys, halfCheckedKeys } = resolveCheckedKeys();
    await savePackageFunctionApi({
      tenantPackageId,
      functionIdList: checkedKeys,
      halfFunctionIdList: halfCheckedKeys,
    });
    successMessage(
      t('system.views.tenant.package.message.saveFunctionSuccess'),
    );
  } finally {
    saveLoading.value = false;
  }
};

onMounted(() => loadFunctionTreeData());
watch(
  () => props.tenantPackageId,
  () => loadPackageFunctionIds(),
);
</script>

<template>
  <Layout class="tree-layout h-full">
    <LayoutHeader class="header bg-background">
      <h3>{{ t('system.views.tenant.package.title.setFunction') }}</h3>
    </LayoutHeader>
    <Divider style="margin: 0" />
    <LayoutContent class="content bg-background">
      <Spin :spinning="dataLoading">
        <Tree
          v-model:checked-keys="checkedKeysModel"
          :tree-data="functionTreeData"
          checkable
        />
      </Spin>
    </LayoutContent>
    <Divider style="margin: 0" />
    <LayoutFooter class="footer bg-background">
      <div style="padding: 0 5px">
        <SmartIconButton
          :loading="saveLoading"
          block
          type="primary"
          @click="handleSave"
        >
          {{ t('common.button.save') }}
        </SmartIconButton>
      </div>
    </LayoutFooter>
  </Layout>
</template>

<style scoped lang="less">
.tree-layout {
  .header {
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: hsl(var(--background)) !important;
    font-weight: 600;
    font-size: 18px;
  }

  .content {
    overflow: auto;
  }

  .footer {
    height: 50px;
    padding: 10px 0;
    text-align: center;
    background: hsl(var(--background)) !important;
  }
}
</style>
