// import type { VxeColumnSlotTypes, VxeTablePropTypes } from 'vxe-table';
//
// import type { SmartTableColumn, SmartTableRenderProps } from '../types';
//
// import type { VNode } from 'vue';
// import { computed, unref } from 'vue';
//
// import { isBoolean, isFunction } from '@/utils/is';
// import XEUtils from 'xe-utils';
//
// import { getFormSize } from '../utils';
//
// const getComponentProps = (
//   params: VxeColumnSlotTypes.DefaultSlotParams,
//   column: SmartTableColumn,
// ): Record<string, any> => {
//   const componentProps = column.componentProps;
//   let props;
//   props = isFunction(componentProps) ? componentProps(params) : componentProps;
//   return props;
// };
//
// const componentMap: {
//   [index: string]: (
//     column: SmartTableColumn,
//     t: (args: string) => string,
//   ) => (params: VxeColumnSlotTypes.DefaultSlotParams) => string | VNode;
// } = {
//   booleanTag: (column, t) => {
//     return (params) => {
//       const componentProps = getComponentProps(params, column);
//       const defaultValue =
//         componentProps?.default || params.row[params.column.field];
//       if (!isBoolean(defaultValue)) {
//         return '';
//       }
//       const props: Record<string, any> = {
//         ...componentProps,
//         color: defaultValue ? '#108ee9' : '#f50',
//       };
//       return (
//         <a-tag {...props}>
//           {defaultValue ? t('common.form.yes') : t('common.form.no')}
//         </a-tag>
//       );
//     };
//   },
//   button: (column) => {
//     return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
//       const props: Record<string, any> = {
//         size: params.$table.props.size,
//         ...getComponentProps(params, column),
//       };
//       const defaultValue = props?.default || params.row[params.column.field];
//       return <a-button {...props}>{defaultValue}</a-button>;
//     };
//   },
//   switch: (column) => {
//     return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
//       const props = {
//         checked: params.row[params.column.field],
//         ...getComponentProps(params, column),
//       };
//       return <a-switch {...props} />;
//     };
//   },
//   tag: (column) => {
//     return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
//       const props = getComponentProps(params, column);
//       const defaultValue = props?.default || params.row[params.column.field];
//       return <a-tag {...props}>{defaultValue}</a-tag>;
//     };
//   },
//   useYnTag: (column, t) => {
//     return (params) => {
//       const componentProps = getComponentProps(params, column);
//       const defaultValue =
//         componentProps?.default || params.row[params.column.field];
//       if (!isBoolean(defaultValue)) {
//         return '';
//       }
//       const props: Record<string, any> = {
//         ...componentProps,
//         color: defaultValue ? '#108ee9' : '#f50',
//       };
//       return (
//         <a-tag {...props}>
//           {defaultValue ? t('common.form.use') : t('common.form.noUse')}
//         </a-tag>
//       );
//     };
//   },
// };
//
// const useSmartTableColumn = (
//   tableProps: SmartTableRenderProps,
//   t: (args: string) => string,
// ) => {
//   const computedTableColumns = computed<Array<SmartTableColumn>>(
//     (): SmartTableColumn[] => {
//       const propsColumns = unref(tableProps).columns || [];
//       const tableSize = unref(tableProps).size;
//       const result = propsColumns.map((column) => {
//         const { component, slots } = column;
//         if (!component || slots) {
//           return column;
//         }
//         const defaultSlot = componentMap[component];
//         if (!defaultSlot) {
//           return column;
//         }
//         return {
//           ...column,
//           slots: {
//             default: defaultSlot(column, t),
//           },
//         };
//       });
//       return convertEditRender(result, tableSize);
//     },
//   );
//
//   /**
//    * 可编辑表格计算属性
//    */
//   const computedEditRules = computed<null | VxeTablePropTypes.EditRules>(() => {
//     const rules: VxeTablePropTypes.EditRules = {};
//     const propsColumns = unref(tableProps).columns || [];
//     for (const { editRender, field } of propsColumns) {
//       if (!editRender) {
//         continue;
//       }
//       if (editRender.rules) {
//         rules[field!] = editRender.rules;
//         continue;
//       }
//       if (!editRender.required) {
//         continue;
//       }
//       rules[field!] = [
//         {
//           content: '请输入',
//           required: true,
//         },
//       ];
//     }
//     if (Object.keys(rules).length === 0) {
//       return null;
//     }
//     return rules;
//   });
//   return {
//     computedEditRules,
//     computedTableColumns,
//   };
// };
//
// /**
//  * 转换可编辑列
//  * @param columns
//  * @param tableSize
//  */
// const convertEditRender = (
//   columns: SmartTableColumn[],
//   tableSize,
// ): SmartTableColumn[] => {
//   return columns.map((column) => {
//     const { editRender } = column;
//     if (!editRender) {
//       return column;
//     }
//     const convertProps: Record<string, any> = {};
//     // 处理尺寸
//     convertProps.size = getFormSize(tableSize);
//     const editRenderConvert: Record<string, any> = {};
//     // 处理自动聚焦
//     const { autofocus, name, props } = editRender;
//     if (isBoolean(autofocus) && autofocus) {
//       if (name === 'ASelect') {
//         editRenderConvert.autofocus = '.ant-select-selection-search-input';
//       } else if (name === 'ADatePicker') {
//         editRenderConvert.autofocus = '.ant-picker-input input';
//       } else {
//         editRenderConvert.autofocus = undefined;
//       }
//     }
//     // 处理事件冒泡
//     if (editRender.stopEnterBubbling !== false) {
//       convertProps.onKeydown = (event: KeyboardEvent) => {
//         if (event.key === 'Enter') {
//           event.stopPropagation();
//         }
//       };
//     }
//
//     if (XEUtils.isFunction(props)) {
//       const defaultProps = editRender.props as Function;
//       editRenderConvert.props = (row) => {
//         return {
//           ...convertProps,
//           ...defaultProps(row),
//         };
//       };
//     } else {
//       editRenderConvert.props = {
//         ...convertProps,
//         ...editRender.props,
//       };
//     }
//     return {
//       ...column,
//       editRender: {
//         ...editRender,
//         ...editRenderConvert,
//       },
//     };
//   });
// };
//
// export { useSmartTableColumn };
const abc = 123;
export { abc };
