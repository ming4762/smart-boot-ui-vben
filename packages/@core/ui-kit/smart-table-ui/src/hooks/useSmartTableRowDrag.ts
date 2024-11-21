import type { Sortable } from '@vben-core/composables';
import type { Recordable } from '@vben-core/typings';

import type { SmartTableColumn, SmartTableRenderProps } from '../types';
import type { SmartTableRowDragConfig } from '../types/SmartTableRowType';

import {
  computed,
  type ComputedRef,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  unref,
  watch,
} from 'vue';

import { useSortable } from '@vben-core/composables';
import { createIconifyIcon } from '@vben-core/icons';
import { isBoolean } from '@vben-core/shared/utils';

import { useSmartTableContext } from '../types/useSmartTableContext';

export const TABLE_DRAG_SLOT_NAME = 'smart-table-row-drop-slot';

const defaultRowDragConfig: SmartTableRowDragConfig = {
  animation: 150,
  dataIdAttr: 'rowid',
  ghostClass: 'blue-background-class',
  handle: 'smart-table-drop-handle',
  icon: 'ant-design:menu-outlined',
};

/**
 * vxe-table已支持行拖拽
 * @deprecated
 * @param tableProps
 */
export const useSmartTableRowDrag = (
  tableProps: ComputedRef<SmartTableRenderProps>,
) => {
  let sortable: null | Sortable = null;

  const computedKeyField = computed(
    () => unref(tableProps).rowConfig?.keyField,
  );

  // 是否有左侧锁定列
  const getHasFixedLeft = computed(() => {
    const tableColumns = unref(tableProps).columns;
    if (!tableColumns) {
      return false;
    }
    return tableColumns.some((item) => item.fixed === 'left');
  });

  /**
   * 获取拖拽配置
   */
  const getRowDragConfig = computed<false | SmartTableRowDragConfig>(() => {
    const { dragConfig } = unref(tableProps).rowConfig || {};
    if (!dragConfig) {
      return false;
    }
    const config: SmartTableRowDragConfig = isBoolean(dragConfig)
      ? defaultRowDragConfig
      : {
          ...defaultRowDragConfig,
          ...dragConfig,
        };
    const { getGrid } = useSmartTableContext();
    return {
      ...config,
      handle: `.${config.handle}`,
      onEnd: async ({ newIndex, oldIndex }) => {
        const keyFiled = unref(computedKeyField);
        if (!keyFiled) {
          return false;
        }
        if (newIndex !== oldIndex) {
          const tableData = getGrid().getTableData().tableData;
          // 记录原顺序
          const keySorts = tableData.map((item) => {
            return `${item[keyFiled]}`;
          });
          const currentRow = tableData.splice(oldIndex as number, 1)[0];
          tableData.splice(newIndex as number, 0, currentRow);
          // 还原顺序
          sortable?.sort(keySorts);
          // 更新数据排序
          getGrid().loadData(tableData);
        }
      },
    };
  });

  /**
   * 获取拖拽插槽
   */
  const getTableDragSlot = computed(() => {
    const dragConfig = unref(getRowDragConfig);
    if (!dragConfig) {
      return {};
    }
    if (dragConfig.custom) {
      // 自定义列，返回null
      return {};
    }
    const slots: Recordable<any> = {};
    slots[TABLE_DRAG_SLOT_NAME] = ({ rowIndex }: any) => {
      return h(
        'div',
        { class: [dragConfig.handle?.slice(1)], 'data-id': rowIndex },
        h(createIconifyIcon(dragConfig.icon as string), {
          'data-id': rowIndex,
        }),
      );
    };
    return slots;
  });

  /**
   * 获取拖拽列信息
   */
  const getTableDragColumn = computed<SmartTableColumn[]>(() => {
    const dragConfig = unref(getRowDragConfig);
    if (!dragConfig) {
      return [];
    }
    if (dragConfig.custom) {
      // 自定义列，返回null
      return [];
    }
    const column: SmartTableColumn = {
      field: 'drag',
      // fixed: 'left',
      slots: {
        default: TABLE_DRAG_SLOT_NAME,
      },
      title: '#',
      width: 60,
    };
    if (unref(getHasFixedLeft)) {
      column.fixed = 'left';
    }
    return [column];
  });

  /**
   * 开启拖拽功能
   */
  const openRowDrop = async () => {
    if (!unref(computedKeyField)) {
      throw new Error('row-config.key-field无法开启行拖拽，请设置key-field');
    }
    if (sortable !== null) {
      sortable.destroy();
    }
    const { getGrid } = useSmartTableContext();
    const el = getGrid().$el;
    let sortEl;
    if (unref(getHasFixedLeft)) {
      const selector = '.fixed-left--wrapper>.vxe-table--body tbody';
      sortEl = el.querySelector(selector);
      if (sortEl === null) {
        while (sortEl === null) {
          await nextTick(() => (sortEl = el.querySelector(selector)));
        }
      }
    } else {
      sortEl = el.querySelector('.body--wrapper>.vxe-table--body tbody');
    }
    const { initializeSortable } = useSortable(
      sortEl,
      unref(getRowDragConfig) as SmartTableRowDragConfig,
    );
    sortable = await initializeSortable();
  };

  /**
   * 关闭行拖拽
   */
  const closeRowDrop = () => {
    if (sortable !== null) {
      sortable.destroy();
      sortable = null;
    }
  };

  onMounted(() => {
    if (unref(getRowDragConfig)) {
      openRowDrop();
    }
  });
  onUnmounted(() => closeRowDrop());

  watch(getRowDragConfig, (value) => {
    const { getGrid } = useSmartTableContext();
    if (value) {
      if (sortable === null && getGrid()) {
        openRowDrop();
      }
    } else {
      closeRowDrop();
    }
  });

  return {
    closeRowDrop,
    getTableDragColumn,
    getTableDragSlot,
    openRowDrop,
  };
};
