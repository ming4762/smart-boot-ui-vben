<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed, onMounted, reactive, ref, unref, useAttrs } from 'vue';

import { $t } from '@vben/locales';
import { listToTree } from '@vben/utils';

import { ApiServiceEnum, requestClient } from '@smart/common/api';
import { errorMessage } from '@smart/common/utils';
import { InputSearch, Spin, Tree } from 'antdv-next';

interface Props {
  async?: boolean;
  showSearch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  async: false,
});

const attrs = useAttrs();

const searchValue = ref<string>('');
const dataList = ref<Array<any>>([]);
const autoExpandParent = ref(false);
const expandedKeys = ref<Array<number>>([]);
const loading = ref(false);

const fieldNames = reactive({
  children: 'children',
  title: 'deptName',
  key: 'deptId',
});

/**
 * 请求部门数据
 */
const loadData = async (parentId?: null | number) => {
  const parameter: Recordable<any> = {
    sortName: 'seq',
    sortOrder: 'asc',
  };
  if (parentId !== undefined && parentId !== null) {
    parameter.parameter = {
      'parentId@=': parentId,
    };
  }
  try {
    loading.value = true;
    const result = await requestClient.post<any[]>('sys/dept/list', parameter, {
      service: ApiServiceEnum.SMART_SYSTEM,
    });

    result.forEach((item) => {
      if (item.hasChild !== true) {
        item.isLeaf = true;
      }
    });
    return result;
  } catch (error: any) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
};

const loadRootData = async () => {
  const data = await loadData(props.async ? 0 : undefined);
  if (data) {
    dataList.value = data;
  }
};

const updateTreeData = (
  list: Array<any>,
  deptId: number,
  children: Array<any>,
): Array<any> => {
  return list.map((item) => {
    if (item.deptId === deptId) {
      return { ...item, children };
    }
    if (item.children) {
      return {
        ...item,
        children: updateTreeData(item.children, deptId, children),
      };
    }
    return item;
  });
};

const handleAsyncLoadData = async (treeNode: any) => {
  const children = await loadData(treeNode.deptId);
  if (children) {
    dataList.value = updateTreeData(dataList.value, treeNode.deptId, children);
  }
};

const getAttrs = computed(() => {
  const result: any = {
    ...attrs,
  };
  if (unref(props.async)) {
    result.loadData = handleAsyncLoadData;
  }
  return result;
});

/**
 * 树形数据计算属性
 */
const computedTreeData = computed(() => {
  if (props.async) {
    return unref(dataList);
  }
  const convertDataList = unref(dataList).map(
    ({ deptId, deptName, deptCode, parentId }) => {
      return {
        deptId,
        deptName,
        deptCode,
        parentId,
      };
    },
  );
  return (
    listToTree(
      convertDataList,
      (item) => item.deptId,
      (item) => item.parentId,
      0,
    ) || []
  );
});

const onExpand = (keys: Array<number | string>) => {
  expandedKeys.value = keys as number[];
  autoExpandParent.value = false;
};

/**
 * 加载数据
 */
onMounted(loadRootData);

defineExpose({
  reload: loadRootData,
});
</script>

<template>
  <div>
    <div v-if="showSearch" class="search-container">
      <InputSearch
        v-model:value="searchValue"
        :placeholder="$t('system.views.dept.search.deptName')"
      />
    </div>
    <Spin :spinning="loading">
      <Tree
        v-bind="getAttrs"
        :auto-expand-parent="autoExpandParent"
        :expanded-keys="expandedKeys"
        :field-names="fieldNames"
        :tree-data="computedTreeData"
        @expand="onExpand"
      >
        <template #titleRender="{ deptName }">
          <span v-if="!showSearch">
            {{ deptName }}
          </span>
          <span v-else-if="deptName.includes(searchValue)">
            {{ deptName.substring(0, deptName.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{
              deptName.substring(
                deptName.indexOf(searchValue) + searchValue.length,
              )
            }}
          </span>
          <span v-else>{{ deptName }}</span>
        </template>
      </Tree>
    </Spin>
  </div>
</template>

<style scoped>
.search-container {
  margin-bottom: 10px;
}
</style>
