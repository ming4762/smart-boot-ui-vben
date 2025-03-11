<script setup lang="ts">
import { computed, onMounted, ref, unref, useTemplateRef, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t as t } from '@vben/locales';

import {
  Button,
  Divider,
  Layout,
  LayoutContent,
  LayoutFooter,
  Spin,
  Tree,
} from 'ant-design-vue';

import { createConfirm, successMessage } from '#/utils';

import {
  listDataPermissionWithFunctionApi,
  listRoleDataPermissionIdApi,
  setRoleDataPermissionApi,
} from '../RoleListView.api';
import { Permission } from '../RoleListView.config';
import DataPermissionDetailModal from './DataPermissionDetailModal.vue';

interface Props {
  roleId?: number | string;
  isSuperAdmin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSuperAdmin: false,
  roleId: undefined,
});

const dataLoadingRef = ref(false);
const saveLoadingRef = ref(false);
const dataPermissionListRef = ref<any[]>([]);
const checkedKeysRef = ref<number[]>([]);

const treeRef = useTemplateRef('treeRef');

/**
 * 加载整个数结构
 */
const loadDataPermission = async () => {
  dataLoadingRef.value = true;
  try {
    dataPermissionListRef.value = await listDataPermissionWithFunctionApi();
  } finally {
    dataLoadingRef.value = false;
  }
};
/**
 * 所有的功能权限ID
 */
const computedAllDataPermissionIds = computed(() => {
  const dataPermissionIds = new Set<number>();
  filterDataPermissionIdFromTree(
    unref(dataPermissionListRef),
    dataPermissionIds,
  );
  return dataPermissionIds;
});
const filterDataPermissionIdFromTree = (
  treeList: any[],
  dataPermissionIds: Set<number>,
) => {
  treeList.forEach((treeNode) => {
    const { data, children } = treeNode;
    if (data.isDataPermission) {
      dataPermissionIds.add(data.dataId);
    } else if (children && children.length > 0) {
      filterDataPermissionIdFromTree(children, dataPermissionIds);
    }
  });
};
// const setFunctionDisableCheckbox = (treeData: any[]) => {
//   treeData.forEach((item) => {
//     if (!item.data.isDataPermission) {
//       item.disableCheckbox = true;
//     }
//     if (item.children && item.children.length > 0) {
//       setFunctionDisableCheckbox(item.children);
//     }
//   });
// };
// const computedTreeData = computed(() => {
//   const dataList = unref(dataPermissionListRef);
//   setFunctionDisableCheckbox(dataList);
//   return dataList;
// });

onMounted(() => {
  loadDataPermission();
});

/**
 * 角色变更，重新加载数据权限
 */
const handleListRoleDataPermission = async () => {
  if (!props.roleId) {
    checkedKeysRef.value = [];
    return;
  }
  try {
    dataLoadingRef.value = true;
    checkedKeysRef.value = await listRoleDataPermissionIdApi(
      props.roleId as number,
    );
  } finally {
    dataLoadingRef.value = false;
  }
};
watch(
  () => props.roleId,
  () => {
    handleListRoleDataPermission();
  },
);

/**
 * 执行保存操作
 */
const handleSave = () => {
  if (!props.roleId) {
    throw new Error('系统异常');
  }
  createConfirm({
    iconType: 'warning',
    title: t('common.confirm'),
    onOk: async () => {
      const allDataPermissionIds = unref(computedAllDataPermissionIds);
      await setRoleDataPermissionApi({
        roleId: props.roleId as number,
        dataPermissionIdList: unref(checkedKeysRef).filter((item) =>
          allDataPermissionIds.has(item),
        ),
      });
      successMessage(t('common.message.saveSuccess'));
    },
  });
};

/**
 * 显示数据权限详情
 * @param dataPermissionId
 */
const [DataPermissionDetailModalRender, modalApi] = useVbenModal({
  connectedComponent: DataPermissionDetailModal,
});
const handleShowDataPermissionDetail = (dataPermissionId: number) => {
  modalApi.setData({ dataPermissionId });
  modalApi.open();
};
</script>

<template>
  <Layout class="role-data-permission h-full">
    <LayoutContent style="overflow: auto" class="bg-background">
      <Spin :spinning="dataLoadingRef" class="tree-loading">
        <Tree
          ref="treeRef"
          :field-names="{ children: 'children', title: 'text', key: 'id' }"
          v-model:checked-keys="checkedKeysRef"
          :disabled="isSuperAdmin"
          :tree-data="dataPermissionListRef"
          checkable
        >
          <template #title="{ data, text }">
            <div v-if="data.data.isDataPermission !== true">
              <span>{{ text }}</span>
            </div>
            <div class="flex items-center" v-else>
              <Button
                @click="() => handleShowDataPermissionDetail(data.id)"
                type="link"
              >
                {{ text }}[{{ data.data.dataPermissionScope }}]
              </Button>
            </div>
          </template>
        </Tree>
      </Spin>
    </LayoutContent>
    <Divider style="margin: 0" />
    <LayoutFooter
      class="layout-footer"
      style="height: 50px; padding: 10px 0; text-align: center"
    >
      <div style="padding: 0 5px">
        <Button
          :disabled="isSuperAdmin || !props.roleId"
          :loading="saveLoadingRef"
          block
          type="primary"
          v-access:code="Permission.setFunction"
          @click="handleSave"
        >
          {{ t('common.button.save') }}
        </Button>
      </div>
    </LayoutFooter>
    <DataPermissionDetailModalRender />
  </Layout>
</template>

<style scoped>
.layout-header {
  background: hsl(var(--background));
}

.layout-footer {
  background: hsl(var(--background));
}

.role-data-permission {
  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-btn-link) {
    padding: 0;
  }
}
</style>
