<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed, onMounted, reactive, ref, unref, useAttrs } from 'vue';

import { $t } from '@vben/locales';
import { listToTree } from '@vben/utils';

import { InputSearch, Spin, Tree } from 'ant-design-vue';

import { ApiServiceEnum, requestClient } from '#/api/request';
import { errorMessage } from '#/utils';

interface Props {
  showSearch?: boolean;
  async?: boolean;
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
 * 加载数据函数
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
    if (props.async) {
      if (parentId === 0) {
        dataList.value = result;
      } else {
        return result;
      }
    } else {
      dataList.value = result;
    }
  } catch (error: any) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
};

const handleAsyncLoadData = async (treeNode: any) => {
  const dataRef = treeNode.dataRef;
  dataRef.children = await loadData(dataRef.deptId);
  dataList.value = [...unref(dataList)];
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
onMounted(() => {
  let parentId: number | undefined;
  if (props.async) {
    parentId = 0;
  }
  loadData(parentId);
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
        <template #title="{ deptName }">
          <span v-if="!showSearch">
            {{ deptName }}
          </span>
          <span v-else-if="deptName.indexOf(searchValue) > -1">
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
