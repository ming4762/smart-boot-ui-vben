<script setup lang="tsx">
import type { Recordable } from '@vben-core/typings';
import type {
  VxeColumnPropTypes,
  VxeGridInstance,
  VxeGridProps,
  VxeGridPropTypes,
  VxePulldownInstance,
  VxeTableDefines,
} from 'vxe-table';

import type { SmartTableToolbarColumnConfig } from '../types/SmartTableToolbarConfigType';

import { computed, ref, unref, useTemplateRef } from 'vue';

import { VxeButton, VxePulldown } from 'vxe-pc-ui';
import { VxeGrid, getI18n as vxeI18n } from 'vxe-table';

import { injectSmartTableContext } from '../hooks/useSmartTableContext';

interface Props {
  config?: SmartTableToolbarColumnConfig;
}

interface ChangeColumn {
  checked: boolean;
  column: VxeTableDefines.ColumnInfo;
}

defineOptions({
  name: 'SmartTableColumnConfig',
});

const props = withDefaults(defineProps<Props>(), {
  config: () => {
    return {
      buttonProps: {
        icon: 'vxe-icon-chart-radar',
      },
      columnOrder: false,
      trigger: 'click',
    };
  },
});

const pullDownRef = useTemplateRef<VxePulldownInstance>('pullDownRef');
const configGridRef = useTemplateRef<VxeGridInstance>('configGridRef');

const { getGrid } = injectSmartTableContext();

/**
 * 变更的列
 */
const changeColumnsRef = ref<Recordable<ChangeColumn | null>>({});

/**
 * 重置列显示隐藏
 */
const handleRestShowHide = () => {
  getGrid().resetCustom({
    fixed: true,
    visible: true,
  });
  changeColumnsRef.value = {};
};

/**
 * 点击确定显示隐藏列
 */
const handleShowHideOk = () => {
  const table = getGrid();
  Object.entries(unref(changeColumnsRef)).forEach(([_, column]) => {
    if (column !== null) {
      if (column.checked) {
        table.showColumn(column.column);
      } else {
        table.hideColumn(column.column);
      }
    }
  });
  changeColumnsRef.value = {};
};

const getGridColumns = (changeFixed: Function): VxeGridPropTypes.Columns => {
  const columns: VxeGridPropTypes.Columns = [];
  columns.push(
    ...([
      {
        headerAlign: 'left',
        type: 'checkbox',
        width: '60',
      },
      {
        field: 'title',
        title: '列名',
        width: 100,
      },
      {
        field: 'fixed',
        slots: {
          default: ({ row }) => {
            return (
              <div class="smart-table-column-config-fixed-option">
                <span
                  class={[
                    row.fixed === 'left'
                      ? 'vxe-icon-fixed-left-fill'
                      : 'vxe-icon-fixed-left',
                    'fixed-span',
                    {
                      'is--checked': row.fixed === 'left',
                    },
                  ]}
                  onClick={(event) => changeFixed(event, 'left', row)}
                  title={vxeI18n(
                    row.fixed === 'left'
                      ? 'vxe.toolbar.cancelfixed'
                      : 'vxe.toolbar.fixedLeft',
                  )}
                />
                <span
                  class={[
                    row.fixed === 'right'
                      ? 'vxe-icon-fixed-right-fill'
                      : 'vxe-icon-fixed-right',
                    'fixed-span',
                    {
                      'is--checked': row.fixed === 'right',
                    },
                  ]}
                  onClick={(event) => changeFixed(event, 'right', row)}
                  title={vxeI18n(
                    row.fixed === 'right'
                      ? 'vxe.toolbar.cancelfixed'
                      : 'vxe.toolbar.fixedRight',
                  )}
                />
              </div>
            );
          },
        },
        title: '列冻结',
        width: 80,
      },
    ] as VxeGridPropTypes.Columns),
  );
  return columns;
};

/**
 * FIX变更触发
 * @param event
 * @param fixed
 * @param row
 */
const handleFixedChange = (
  event: MouseEvent,
  fixed: VxeColumnPropTypes.Fixed,
  row: any,
) => {
  event.preventDefault();
  if (fixed === row.fixed) {
    (getGrid() as any)
      .extendTableMethods(['clearColumnFixed'])
      .clearColumnFixed(row.field);
  } else {
    (getGrid() as any)
      .extendTableMethods(['setColumnFixed'])
      .setColumnFixed(row.field, fixed);
  }
};

/**
 * 显示隐藏变更触发
 * @param checked
 * @param row
 */
const handleCheckboxChange = ({ checked, row }: any) => {
  const { column } = row;
  const changeColumn = unref(changeColumnsRef)[column.id];
  changeColumnsRef.value[column.id] =
    changeColumn === null || changeColumn === undefined
      ? { checked, column }
      : null;
};

const computedTableColumns = computed(() => {
  return getGrid()?.getTableColumn().fullColumn;
});

const computedGridProps = computed<VxeGridProps>(() => {
  return {
    checkboxConfig: {
      // trigger: 'row',
      checkField: 'checked',
    },
    columns: getGridColumns(handleFixedChange),
    data: unref(computedTableColumns)?.map((item) => {
      const { field, fixed, visible } = item;
      return {
        checked: visible,
        column: item,
        field,
        fixed,
        id: item.id,
        title: item.getTitle(),
      };
    }),
    headerAlign: 'center',
    height: '396px',
    onCheckboxChange: handleCheckboxChange,
    rowConfig: {
      keyField: 'field',
    },
    size: 'mini',
  };
});

/**
 * 显示弹窗面板
 */
const showPanel = () => {
  unref(pullDownRef)?.showPanel();
};

const computedToolButtonProps = computed(() => {
  return {
    circle: true,
    icon: 'vxe-icon-chart-radar',
    ...unref(props).config.buttonProps,
    onClick: () => {
      const trigger = props.config.trigger;
      if (!trigger || trigger === 'click') {
        showPanel();
      }
    },
    onMouseover: () => {
      const trigger = props.config.trigger;
      if (trigger === 'hover') {
        showPanel();
      }
    },
  };
});
</script>

<template>
  <VxePulldown
    ref="pullDownRef"
    popup-class-name="smart-table-column-config"
    transfer
  >
    <VxeButton
      :title="vxeI18n('vxe.toolbar.custom')"
      v-bind="computedToolButtonProps"
    />
    <template #dropdown>
      <div>
        <VxeGrid ref="configGridRef" v-bind="computedGridProps" />
        <div class="bottom-button">
          <VxeButton mode="text" @click="handleRestShowHide">
            {{ vxeI18n('vxe.toolbar.customRestore') }}
          </VxeButton>
          <VxeButton mode="text" @click="handleShowHideOk">
            {{ vxeI18n('vxe.toolbar.customConfirm') }}
          </VxeButton>
        </div>
      </div>
    </template>
  </VxePulldown>
</template>

<style lang="less">
.smart-table-column-config-fixed-option {
  .fixed-span {
    padding: 5px;
    cursor: pointer;

    &:hover {
      color: var(--vxe-primary-color);
    }
  }

  .is--checked {
    color: var(--vxe-primary-color);
  }
}

.smart-table-column-config {
  .vxe-pulldown--panel-wrapper {
    border: 1px solid var(--vxe-table-border-color);
    border-radius: var(--vxe-border-radius);
    box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
  }

  .bottom-button {
    height: 30px;
    line-height: 30px;

    .vxe-button {
      width: 50%;
    }
  }
}
</style>
