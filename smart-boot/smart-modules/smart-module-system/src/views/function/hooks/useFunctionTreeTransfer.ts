import type { PermissionId, PermissionRow } from '../../../permission-management/types';

import { onBeforeUnmount, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { createConfirm, successMessage, warnMessage } from '@smart/common/utils';
import { useClipboard } from '@vueuse/core';

import { exportTreeApi, importTreeApi } from '../FunctionListView.api';

/** 功能树导入导出依赖，由页面提供当前勾选和导入后的刷新动作。 */
interface UseFunctionTreeTransferOptions {
  applicationCode?: null | string;
  getSelectedRows: () => PermissionRow[];
  onImported: () => Promise<void>;
  signal?: AbortSignal;
}

/**
 * 封装功能树 JSON 的导出、目标选择和粘贴导入流程。
 *
 * @param options 应用范围、勾选记录、请求取消信号与导入后的刷新动作
 * @returns 导入导出弹窗、JSON 内容及导入导出事件处理函数
 */
export function useFunctionTreeTransfer(options: UseFunctionTreeTransferOptions) {
  const importTargetId = ref<PermissionId>(0);
  const importJson = ref('');
  const exportJson = ref('');
  const { copy } = useClipboard({ legacy: true });
  let exportRequestId = 0;

  const [ExportModal, exportModalApi] = useVbenModal({
    title: '导出 JSON',
    class: 'w-[900px]',
    cancelText: '取消',
    confirmText: '复制',
    confirmDisabled: true,
    onConfirm: () => handleCopy(),
    onOpenChange: (isOpen) => {
      // 关闭后忽略仍在途中的导出响应，避免旧结果覆盖下一次预览。
      if (!isOpen) {
        exportRequestId += 1;
      }
    },
  });

  const [ImportModal, importModalApi] = useVbenModal({
    title: '导入 JSON',
    description: '请粘贴功能树 JSON',
    class: 'w-[900px]',
    cancelText: '取消',
    confirmText: '导入',
    confirmDisabled: true,
    onConfirm: () => handleConfirmImport(),
  });

  watch(importJson, (value) => {
    importModalApi.setState({ confirmDisabled: !value.trim() });
  });

  onBeforeUnmount(() => {
    exportRequestId += 1;
  });

  /** 复制当前预览的 JSON，失败时保留弹窗供手动复制。 */
  async function handleCopy() {
    if (!exportJson.value) {
      return;
    }
    try {
      await copy(exportJson.value);
      successMessage('JSON 已复制到剪贴板');
    } catch {
      warnMessage('复制失败，请手动选择并复制');
    }
  }

  /** IAM 未配置应用编码时阻止请求，避免落入服务端默认应用。 */
  const requestOptions = () => {
    if (
      options.applicationCode !== undefined &&
      !options.applicationCode?.trim()
    ) {
      throw new Error('客户端未配置应用编码');
    }
    return {
      applicationCode: options.applicationCode ?? undefined,
      signal: options.signal,
    };
  };

  /** 导出选中目录和菜单，并在弹窗中预览返回的 JSON。 */
  async function handleExport() {
    const selected = options.getSelectedRows();
    if (selected.some((row) => row.functionType === 'FUNCTION')) {
      warnMessage('只能勾选目录或菜单导出');
      return;
    }
    const ids = selected
      .filter((row) => row.functionType === 'CATALOG' || row.functionType === 'MENU')
      .map((row) => row.functionId as PermissionId);
    if (ids.length === 0) {
      warnMessage('请选择要导出的目录或菜单');
      return;
    }
    const requestId = ++exportRequestId;
    exportJson.value = '';
    exportModalApi.setState({ loading: true, confirmDisabled: true });
    exportModalApi.open();
    try {
      const json = await exportTreeApi(ids, requestOptions());
      if (requestId !== exportRequestId) {
        return;
      }
      // 增加缩进，便于在编辑器中检查并复制完整的树结构。
      exportJson.value = JSON.stringify(JSON.parse(json), null, 2);
      exportModalApi.setState({ confirmDisabled: false });
    } catch (error) {
      if (requestId !== exportRequestId) {
        return;
      }
      warnMessage(error instanceof Error ? error.message : '导出失败');
      exportModalApi.close();
    } finally {
      if (requestId === exportRequestId) {
        exportModalApi.setState({ loading: false });
      }
    }
  }

  /** 使用当前唯一勾选节点作为导入目标；未选择时须确认导入根目录。 */
  function handleImport() {
    const selected = options.getSelectedRows();
    if (selected.length > 1) {
      warnMessage('导入目标只能选择一个');
      return;
    }
    if (selected[0]?.functionType === 'FUNCTION') {
      warnMessage('功能节点不能作为导入目标');
      return;
    }
    importTargetId.value = selected[0]?.functionId ?? 0;
    if (selected.length === 0) {
      createConfirm({
        content: '未选择目标，确定导入根目录吗？',
        onOk: () => openImportModal(),
      });
      return;
    }
    openImportModal();
  }

  /** 每次打开时清空上次输入，避免将旧 JSON 导入新的目标。 */
  function openImportModal() {
    importJson.value = '';
    importModalApi.setState({ confirmDisabled: true });
    importModalApi.open();
  }

  /** 提交编辑器中的 JSON，由服务端校验功能类型并在事务中导入。 */
  async function handleConfirmImport() {
    const json = importJson.value.trim();
    if (!json) {
      warnMessage('请粘贴要导入的 JSON');
      return;
    }
    if (new Blob([json]).size > 5 * 1024 * 1024) {
      warnMessage('JSON 内容不能超过 5 MB');
      return;
    }
    importModalApi.lock();
    try {
      const count = await importTreeApi(importTargetId.value, json, requestOptions());
      importModalApi.close();
      successMessage(`成功导入 ${count} 个功能节点`);
    } catch (error) {
      warnMessage(error instanceof Error ? error.message : '导入失败');
      return;
    } finally {
      importModalApi.unlock();
    }
    try {
      await options.onImported();
    } catch {
      warnMessage('导入成功，但列表刷新失败，请手动刷新');
    }
  }

  return {
    ExportModal,
    ImportModal,
    exportJson,
    importJson,
    handleExport,
    handleImport,
  };
}
