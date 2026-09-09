<script setup lang="ts">
import type {
  FunctionGrantAdapter,
  PermissionId,
  PermissionRow,
} from './types';

import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { $t } from '@vben/locales';

import { successMessage } from '@smart/common/utils';
import { Alert, Button, Divider, Empty, Spin, Tree } from 'antdv-next';

/** 共用功能授权树。每次资源变化立即清空勾选，旧请求不得覆盖新角色或套餐。 */
const props = defineProps<{
  adapter: FunctionGrantAdapter;
  isSuperAdmin?: boolean;
  resourceId?: PermissionId;
}>();

/** 树控件统一使用字符串键，避免 Long ID 的精度和类型不一致。 */
interface FunctionNode {
  children: FunctionNode[];
  key: string;
  title: string;
}
const { hasAccessByAuth } = useAccess();
const rows = ref<PermissionRow[]>([]);
const checked = ref<string[]>([]);
const loading = ref(false);
const saving = ref(false);
const treeReady = ref(false);
const ready = ref(false);
const failed = ref(false);
let version = 0;
onBeforeUnmount(() => {
  version++;
});

const tree = computed(() => {
  const nodes = new Map<string, FunctionNode>(
    rows.value.map((row) => [
      String(row.functionId),
      { key: String(row.functionId), title: row.functionName, children: [] },
    ]),
  );
  const roots: FunctionNode[] = [];
  rows.value.forEach((row) => {
    const node = nodes.get(String(row.functionId));
    if (!node) return;
    const parent = nodes.get(String(row.parentId));
    if (parent && parent !== node) parent.children.push(node);
    else roots.push(node);
  });
  console.log(roots)
  return roots;
});
const canSave = computed(
  () =>
    ready.value &&
    !loading.value &&
    !saving.value &&
    props.resourceId !== undefined &&
    !props.isSuperAdmin &&
    hasAccessByAuth(props.adapter.permission),
);

/** 加载功能树和勾选结果；切换资源时复用已加载的功能树。 */
async function load(reloadFunctions: boolean) {
  const requestVersion = ++version;
  const id = props.resourceId;
  const adapter = props.adapter;
  const isSuperAdmin = props.isSuperAdmin;
  const shouldReloadFunctions = reloadFunctions || !treeReady.value;
  ready.value = false;
  failed.value = false;
  checked.value = [];
  if (shouldReloadFunctions) {
    rows.value = [];
    treeReady.value = false;
  }
  if (id === undefined || id === null) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const [functions, selection] = await Promise.all([
      shouldReloadFunctions
        ? adapter.listFunctions()
        : Promise.resolve(rows.value),
      isSuperAdmin ? Promise.resolve({ functionIdList: [] }) : adapter.load(id),
    ]);
    if (requestVersion !== version) return;
    if (shouldReloadFunctions) {
      rows.value = functions;
      treeReady.value = true;
    }
    console.log(isSuperAdmin)
    checked.value = (
      isSuperAdmin
        ? functions.map((row) => row.functionId)
        : selection.functionIdList
    ).map(String);
    ready.value = true;
  } catch {
    if (requestVersion === version) failed.value = true;
  } finally {
    if (requestVersion === version) loading.value = false;
  }
}

function reload() {
  void load(true);
}

/** 按父子勾选关系重建完整与半选列表，包括加载后未手动修改的父节点。 */
function resolveSelection() {
  const selected = new Set(checked.value);
  const full = new Set<string>();
  const half = new Set<string>();
  const visit = (node: FunctionNode, inherited = false): number => {
    const selectedHere = inherited || selected.has(node.key);
    const states = node.children.map((child) => visit(child, selectedHere));
    if (
      selectedHere ||
      (states.length > 0 && states.every((state) => state === 2))
    ) {
      full.add(node.key);
      return 2;
    }
    if (states.some((state) => state > 0)) {
      half.add(node.key);
      return 1;
    }
    return 0;
  };
  tree.value.forEach((node) => visit(node));
  return { functionIdList: [...full], halfFunctionIdList: [...half] };
}

/** 保存固定资源的勾选快照；资源切换后不更新新实例的状态。 */
async function save() {
  if (!canSave.value || props.resourceId === undefined) return;
  const requestVersion = version;
  const id = props.resourceId;
  saving.value = true;
  try {
    await props.adapter.save(id, resolveSelection());
    if (requestVersion === version) {
      successMessage($t('common.message.saveSuccess'));
    }
  } catch {
    // 请求层展示服务端错误；保留用户勾选，允许重新保存。
  } finally {
    if (requestVersion === version) saving.value = false;
  }
}
watch(
  () => [props.resourceId, props.isSuperAdmin, props.adapter] as const,
  (current, previous) => {
    saving.value = false;
    void load(current[2] !== previous?.[2]);
  },
  { immediate: true },
);
</script>

<template>
  <section class="tree-container bg-background flex h-full min-h-0 flex-col">
    <Alert
      v-if="failed"
      type="error"
      message="功能授权加载失败，请重新加载"
      class="mb-3"
    />
    <div class="min-h-0 flex-1 overflow-auto">
      <Spin :spinning="loading">
        <Tree
          v-if="resourceId != null && treeReady"
          v-model:checked-keys="checked"
          :tree-data="tree"
          :disabled="!canSave"
          checkable
        />
        <Empty
          v-else-if="!loading && !failed"
          description="请先选择角色或套餐"
        />
      </Spin>
    </div>
    <Divider />
    <div class="flex gap-2 button-container">
      <Button
        class="flex-1"
        :disabled="saving"
        :loading="loading"
        @click="reload"
      >
        {{ $t('common.button.reload') }}
      </Button>
      <Button
        class="flex-1"
        type="primary"
        :disabled="!canSave"
        :loading="saving"
        v-access:code="adapter.permission"
        @click="save"
      >
        {{ $t('common.button.save') }}
      </Button>
    </div>
  </section>
</template>

<style scoped lang="less">
.tree-container {
  :deep(.ant-divider) {
    margin: 10px 0 !important;
  }
  .button-container {
    padding: 0 5px 5px 5px;
  }
}
</style>
