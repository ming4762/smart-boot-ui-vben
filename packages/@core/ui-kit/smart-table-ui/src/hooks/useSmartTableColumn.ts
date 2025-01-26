import type { VxeColumnSlotTypes, VxeTablePropTypes } from 'vxe-table';

import type { Component, ComputedRef, VNode } from 'vue';

import type {
  SmartTableColumn,
  SmartTableRenderProps,
  SmartTableSize,
} from '../types';

import { computed, h, unref } from 'vue';

import {
  formatDate,
  formatDateTime,
  isBoolean,
  isFunction,
} from '@vben-core/shared/utils';

import { getComponent, getFormSize } from '../utils';

const getComponentProps = (
  params: VxeColumnSlotTypes.DefaultSlotParams,
  column: SmartTableColumn,
): Record<string, any> => {
  const componentProps = column.componentProps;
  return isFunction(componentProps) ? componentProps(params) : componentProps;
};

/**
 * 组件map
 */
const componentMap: {
  [index: string]: (
    column: SmartTableColumn,
    t: (args: string) => string,
  ) => (params: VxeColumnSlotTypes.DefaultSlotParams) => string | VNode;
} = {
  booleanTag: (column, t) => {
    return (params) => {
      const componentProps = getComponentProps(params, column);
      const defaultValue =
        componentProps?.default || params.row[params.column.field];
      if (!isBoolean(defaultValue)) {
        return '';
      }
      const props: Record<string, any> = {
        ...componentProps,
        color: defaultValue ? '#108ee9' : '#f50',
      };
      return h(getComponent('Tag') as Component, props, {
        default: () =>
          defaultValue ? t('smartTable.common.yes') : t('smartTable.common.no'),
      });
    };
  },
  button: (column) => {
    return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
      const ButtonComponent = getComponent('Button');
      if (!ButtonComponent) {
        console.warn('component Button not register');
        return '';
      }
      const props: Record<string, any> = {
        size: params.$table.props.size,
        ...getComponentProps(params, column),
      };
      const defaultValue = props?.default || params.row[params.column.field];
      return h(ButtonComponent, props, { default: () => defaultValue });
    };
  },
  switch: (column) => {
    return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
      const props = {
        checked: params.row[params.column.field],
        ...getComponentProps(params, column),
      };
      return h(getComponent('Switch') as Component, props);
    };
  },
  tag: (column) => {
    return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
      const props = getComponentProps(params, column);
      const defaultValue = props?.default || params.row[params.column.field];
      return h(getComponent('Tag') as Component, props, {
        default: () => defaultValue,
      });
    };
  },
  useYnTag: (column, t) => {
    return (params) => {
      const componentProps = getComponentProps(params, column);
      const defaultValue =
        componentProps?.default || params.row[params.column.field];
      if (!isBoolean(defaultValue)) {
        return '';
      }
      const props: Record<string, any> = {
        ...componentProps,
        color: defaultValue ? '#108ee9' : '#f50',
      };
      return h(getComponent('Tag') as Component, props, {
        default: () =>
          defaultValue
            ? t('smartTable.common.use')
            : t('smartTable.common.noUse'),
      });
    };
  },
};

/**
 * 转换可编辑列
 * @param columns
 * @param tableSize
 */
const convertEditRender = (
  columns: SmartTableColumn[],
  tableSize?: SmartTableSize,
): SmartTableColumn[] => {
  return columns.map((column) => {
    const { editRender } = column;
    if (!editRender) {
      return column;
    }
    const convertProps: Record<string, any> = {};
    // 处理尺寸
    convertProps.size = getFormSize(tableSize);
    const editRenderConvert: Record<string, any> = {};
    // 处理自动聚焦
    const { autofocus, name, props } = editRender;
    if (isBoolean(autofocus) && autofocus) {
      if (name === 'ASelect') {
        editRenderConvert.autofocus = '.ant-select-selection-search-input';
      } else if (name === 'ADatePicker') {
        editRenderConvert.autofocus = '.ant-picker-input input';
      } else {
        editRenderConvert.autofocus = undefined;
      }
    }
    // 处理事件冒泡
    if (editRender.stopEnterBubbling !== false) {
      convertProps.onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.stopPropagation();
        }
      };
    }

    editRenderConvert.props = isFunction(props)
      ? (row: any) => {
          return {
            ...convertProps,
            ...props(row),
          };
        }
      : {
          ...convertProps,
          ...editRender.props,
        };
    return {
      ...column,
      editRender: {
        ...editRender,
        ...editRenderConvert,
      },
    };
  });
};

const convertComponent = (
  columns: SmartTableColumn[],
  t: (args: string) => string,
): SmartTableColumn[] => {
  return columns.map((column) => {
    const { component, slots } = column;
    if (!component || slots) {
      return column;
    }
    const defaultSlot = componentMap[component];
    if (!defaultSlot) {
      return column;
    }
    return {
      ...column,
      slots: {
        default: defaultSlot(column, t),
      },
    };
  });
};

const convertDateType = (columns: SmartTableColumn[]): SmartTableColumn[] => {
  return columns.map((column) => {
    const { formatter, type } = column;
    if (!type) {
      return column;
    }
    if (formatter) {
      return column;
    }
    if (type !== 'date' && type !== 'dateTime') {
      return column;
    }
    const handler = type === 'date' ? formatDate : formatDateTime;
    return {
      ...column,
      formatter: ({ cellValue }) => {
        if (!cellValue) {
          return cellValue;
        }
        return handler(cellValue);
      },
      // 移除，防止vxe props警告
      type: undefined,
    };
  });
};

const useSmartTableColumn = (
  tableProps: ComputedRef<SmartTableRenderProps>,
  t: (args: string) => string,
) => {
  const computedTableColumns = computed<Array<SmartTableColumn>>(
    (): SmartTableColumn[] => {
      let columns = unref(tableProps).columns || [];
      const tableSize = unref(tableProps).size;
      // 转换组件
      columns = convertComponent(columns, t);
      // 转换日期类型
      columns = convertDateType(columns);
      return convertEditRender(columns, tableSize);
    },
  );

  /**
   * 可编辑表格计算属性
   */
  const computedEditRules = computed<null | VxeTablePropTypes.EditRules>(() => {
    const rules: VxeTablePropTypes.EditRules = {};
    const propsColumns = unref(tableProps).columns || [];
    for (const { editRender, field } of propsColumns) {
      if (!editRender) {
        continue;
      }
      if (editRender.rules && field) {
        rules[field] = editRender.rules;
        continue;
      }
      if (!editRender.required) {
        continue;
      }
      if (field) {
        rules[field] = [
          {
            content: '请输入',
            required: true,
          },
        ];
      }
    }
    if (Object.keys(rules).length === 0) {
      return null;
    }
    return rules;
  });
  return {
    computedEditRules,
    computedTableColumns,
  };
};

export { useSmartTableColumn };
