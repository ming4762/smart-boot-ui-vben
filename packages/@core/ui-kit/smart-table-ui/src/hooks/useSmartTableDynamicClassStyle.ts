import type { VxeTablePropTypes } from 'vxe-table';

import type { ComputedRef } from 'vue';

import type { Recordable } from '@vben-core/typings';

import type { SmartTableRenderProps } from '../types';
import type {
  SmartTableColumnAutoClass,
  SmartTableColumnDynamicClass,
  SmartTableColumnDynamicStyle,
} from '../types/SmartTableColumnType';

import { computed, unref } from 'vue';

import { isObject, isString } from '@vben-core/shared/utils';

import { warningMessage } from '../utils';

const autoClass: {
  [index in SmartTableColumnAutoClass]: SmartTableColumnDynamicClass;
} = {
  Boolean: ({ column, row }) => {
    const value = row[column.field];
    if (value === null || value === undefined) {
      return '';
    }
    if (value) {
      return 'text-color--success-bold';
    }
    return 'text-color--danger-bold';
  },
};

/**
 * 动态设置表格列的样式
 * @param tablePropsRef
 */
export const useSmartTableDynamicClassStyle = (
  tablePropsRef: ComputedRef<SmartTableRenderProps>,
) => {
  const computedClassName = computed<
    undefined | VxeTablePropTypes.CellClassName
  >(() => {
    const tableProps = unref(tablePropsRef);
    const tableDynamicClass: Recordable<SmartTableColumnDynamicClass> = {};
    tableProps.columns?.forEach((column) => {
      if (column.dynamicClass) {
        if (column.field) {
          tableDynamicClass[column.field] = column.dynamicClass;
        } else {
          console.warn('列未设置field，dynamicClass失效');
        }
      } else if (column.autoClass) {
        if (column.field) {
          tableDynamicClass[column.field] = autoClass[column.autoClass];
        } else {
          console.warn('列未设置field，dynamicClass失效');
        }
      }
    });
    if (tableProps.cellClassName) {
      if (Object.keys(tableDynamicClass).length > 0) {
        console.warn(
          '表格设置了cellClassName，列dynamicClass失效',
        );
      }
      return undefined;
    }
    if (Object.keys(tableDynamicClass).length === 0) {
      return undefined;
    }
    return (params) => {
      const { column } = params;
      const field = column.field;
      const dynamicClass = tableDynamicClass[field];
      if (!dynamicClass) {
        return undefined;
      }
      if (isString(dynamicClass)) {
        return dynamicClass;
      }
      return dynamicClass(params);
    };
  });

  const computedStyle = computed<undefined | VxeTablePropTypes.CellStyle>(
    () => {
      const tableProps = unref(tablePropsRef);
      const tableDynamicStyle: Recordable<SmartTableColumnDynamicStyle> = {};
      tableProps.columns?.forEach((column) => {
        if (column.dynamicStyle) {
          if (column.field) {
            tableDynamicStyle[column.field] = column.dynamicStyle;
          } else {
            console.warn('列未设置field，dynamicStyle失效');
          }
        }
      });
      if (tableProps.cellStyle || tableProps.rowStyle) {
        if (Object.keys(tableDynamicStyle).length > 0) {
          console.warn('表格设置了cellStyle或rowStyle，列dynamicStyle失效');
        }
        return undefined;
      }
      if (Object.keys(tableDynamicStyle).length === 0) {
        return undefined;
      }
      return (params) => {
        const { column } = params;
        const field = column.field;
        const dynamicStyle = tableDynamicStyle[field];
        if (!dynamicStyle) {
          return undefined;
        }
        if (isObject(dynamicStyle)) {
          return dynamicStyle;
        }
        return dynamicStyle(params);
      };
    },
  );

  const computedTableClassStyle = computed(() => {
    const props: Partial<SmartTableRenderProps> = {};
    if (unref(computedClassName)) {
      props.cellClassName = unref(computedClassName);
    }
    if (unref(computedStyle)) {
      props.cellStyle = unref(computedStyle);
    }
    return props;
  });

  return {
    computedTableClassStyle,
  };
};
