<script setup lang="ts">
import { computed, onMounted, ref, toRefs, unref, watch } from 'vue';

import { useTabLazy } from '@vben/hooks';
import { $t as t } from '@vben/locales';
import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { errorMessage, successMessage } from '@smart/common/utils';
import {
  Button,
  Divider,
  Layout,
  LayoutContent,
  LayoutFooter,
  Spin,
  Tree,
} from 'ant-design-vue';

interface Props {
  activated?: boolean;
  isSuperAdmin?: boolean;
  roleId?: number | string;
  tenantId?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  isSuperAdmin: false,
  roleId: undefined,
  tenantId: undefined,
});

const { tenantId: tenantIdRef, activated } = toRefs(props);

const treeRef = ref();

const dataLoading = ref(false);
const saveLoading = ref(false);
const checkedKeysModel = ref<number[]>([]);
const functionListRef = ref<any[]>([]);

// 树形控件数据
const computedFunctionTreeData = computed(() => {
  return (
    listToTree(
      unref(functionListRef).map(
        ({ functionId, functionName, parentId }: any) => {
          return {
            key: functionId,
            title: functionName,
            parentId,
          };
        },
      ),
      (item: any) => item.key,
      (item: any) => item.parentId,
      0,
    ) || []
  );
});
// 所有功能ID
const computedAllFunctionIdList = computed<number[]>(() => {
  return unref(functionListRef).map((item) => item.functionId);
});

/**
 * 加载功能树函数
 */
const loadFunctionTreeData = async () => {
  dataLoading.value = true;
  try {
    if (!props.tenantId) {
      functionListRef.value = [];
      return;
    }
    functionListRef.value = await requestClient.post<any[]>(
      'sys/function/listTenantFunction',
      {
        id: props.tenantId,
      },
      {
        service: ApiServiceEnum.SMART_SYSTEM,
      },
    );
  } finally {
    dataLoading.value = false;
  }
};

/**
 * 加载角色对应的功能ID
 */
const loadRoleFunctions = async () => {
  if (props.roleId !== null) {
    dataLoading.value = true;
    try {
      checkedKeysModel.value = await requestClient.post(
        'sys/role/listFunctionId',
        {
          id: props.roleId,
        },
        {
          service: ApiServiceEnum.SMART_SYSTEM,
        },
      );
    } finally {
      dataLoading.value = false;
    }
  }
};

onMounted(() => loadFunctionTreeData());
/**
 * 监控当前tab是否激活
 * 激活时，自动查询数据
 */
useTabLazy(tenantIdRef, activated, () => {
  checkedKeysModel.value = [];
  loadFunctionTreeData();
});

watch(
  () => props.roleId,
  () => {
    if (props.isSuperAdmin) {
      checkedKeysModel.value = unref(computedAllFunctionIdList);
    } else {
      loadRoleFunctions();
    }
  },
);

/**
 * 执行保存操作
 */
const handleSave = async () => {
  const tree = unref(treeRef);
  if (props.roleId === null) {
    errorMessage('请先选定角色');
    return false;
  }
  saveLoading.value = true;
  try {
    await requestClient.post(
      'sys/role/saveRoleMenu',
      {
        roleId: props.roleId,
        functionIdList: tree.checkedKeys,
        halfFunctionIdList: tree.halfCheckedKeys,
      },
      {
        service: ApiServiceEnum.SMART_SYSTEM,
      },
    );
    successMessage(t('common.message.saveSuccess'));
  } finally {
    saveLoading.value = false;
  }
};

const handleReload = () => {
  checkedKeysModel.value = [];
  loadFunctionTreeData();
  loadRoleFunctions();
};
</script>

<template>
  <Layout class="role-set-function h-full">
    <LayoutContent style="overflow: auto" class="bg-background">
      <Spin :spinning="dataLoading">
        <Tree
          ref="treeRef"
          v-model:checked-keys="checkedKeysModel"
          :disabled="isSuperAdmin"
          :tree-data="computedFunctionTreeData"
          checkable
        />
      </Spin>
    </LayoutContent>
    <Divider style="margin: 0" />
    <LayoutFooter
      class="layout-footer"
      style="height: 50px; padding: 10px 0; text-align: center"
    >
      <div style="padding: 0 5px">
        <Button
          @click="handleReload"
          :loading="dataLoading"
          class="reload-button"
        >
          {{ t('common.button.reload') }}
        </Button>
        <Button
          :disabled="isSuperAdmin || !props.roleId"
          :loading="saveLoading"
          type="primary"
          class="save-button"
          @click="handleSave"
        >
          {{ t('common.button.save') }}
        </Button>
      </div>
    </LayoutFooter>
  </Layout>
</template>

<style scoped lang="less">
.layout-header {
  background: hsl(var(--background));
}
.layout-footer {
  background: hsl(var(--background));
}
.role-set-function {
  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }
  .reload-button {
    width: 45%;
  }
  .save-button {
    width: 45%;
    margin-left: 5px;
  }
}
</style>
