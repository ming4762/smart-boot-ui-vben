<script setup lang="ts">
import { ApiServiceEnum, requestClient } from '#/api/request';
import { errorMessage, successMessage } from '#/utils';
import { $t as t } from '@vben/locales';
import { listToTree } from '@vben/utils';
import {
  Button,
  Divider,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  Spin,
  Tree,
} from 'ant-design-vue';
import { onActivated, ref, unref, watch } from 'vue';

import { Permission } from '../RoleListView.config';

interface Props {
  roleId?: number;
  isSuperAdmin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSuperAdmin: false,
  roleId: -1,
});

const treeRef = ref();

// 树形控件数据
const functionTreeData = ref<Array<any>>([]);
const dataLoading = ref(false);
const saveLoading = ref(false);
const checkedKeysModel = ref([]);
const permissions = Permission;

/**
 * 加载功能树函数
 */
const loadFunctionTreeData = async () => {
  dataLoading.value = true;
  try {
    const result = await requestClient.post(
      'sys/function/listTenantFunction',
      {
        sortName: 'seq',
      },
      {
        service: ApiServiceEnum.SMART_SYSTEM,
      },
    );

    functionTreeData.value =
      listToTree(
        result.map(({ functionId, functionName, parentId }: any) => {
          return {
            key: functionId,
            title: functionName,
            parentId,
          };
        }),
        (item: any) => item.key,
        (item: any) => item.parentId,
        0,
      ) || [];
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

onActivated(() => loadFunctionTreeData());
watch(
  () => props.roleId,
  () => loadRoleFunctions(),
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
  // const treeDataList = getTreeDataList();
  // const treeDataMap = new Map<number, any>();
  // treeDataList.forEach((item) => {
  //   treeDataMap.set(item.key, item);
  // });
  // const checkedKeys = tree.getCheckedKeys().filter((item) => {
  //   if (!treeDataMap.has(item)) {
  //     return false;
  //   }
  //   const treeData = treeDataMap.get(item);
  //   return treeData.hasChild !== true;
  // });
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
    successMessage('保存成功');
  } finally {
    saveLoading.value = false;
  }
};

// const getTreeDataList = () => {
//   const treeData = unref(treeRef).getTreeData();
//   const treeDataList: any[] = [];
//   doGetTreeDataList(treeDataList, treeData);
//   return treeDataList;
// };
//
// const doGetTreeDataList = (treeDataList: any[], treeData: any[]) => {
//   treeData.forEach((item) => {
//     treeDataList.push(item);
//     if (item.children && item.children.length > 0) {
//       doGetTreeDataList(treeDataList, item.children);
//     }
//   });
// };
</script>

<template>
  <Layout class="h-full">
    <LayoutHeader
      class="layout-header"
      style="height: 48px; line-height: 48px; text-align: center"
    >
      <h3>{{ t('system.views.role.title.setFunction') }}</h3>
    </LayoutHeader>
    <Divider style="margin: 0" />
    <LayoutContent style="overflow: auto" class="bg-background">
      <Spin :spinning="dataLoading">
        <Tree
          ref="treeRef"
          v-model:checked-keys="checkedKeysModel"
          :disabled="isSuperAdmin"
          :tree-data="functionTreeData"
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
          :disabled="isSuperAdmin"
          :loading="saveLoading"
          block
          type="primary"
          v-access:code="permissions.setFunction"
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
</style>
