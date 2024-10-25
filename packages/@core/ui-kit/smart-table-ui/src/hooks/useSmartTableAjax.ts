// import type { SmartTableProxyAjax, SmartTableRenderProps, SmartTableFetchParams, SmartTableAjaxQueryParams } from '../types';
//
// import { computed } from 'vue';
//
// import { merge } from '@vben-core/shared/utils';
//
// const useSmartTableAjax = (tableProps: SmartTableRenderProps) => {
//   const initQuery = false;
//
//   const computedProxyConfig = computed(() => {
//     const { proxyConfig, sortConfig, useSearchForm } = unref(tableProps);
//     if (!proxyConfig) {
//       return undefined;
//     }
//     const ajax: SmartTableProxyAjax = proxyConfig.ajax || {};
//     let queryAjax: SmartTableProxyAjax = {};
//
//     if (ajax.query) {
//       queryAjax = {
//         query: async (params, args) => {
//           const { filters, form, page, sorts, sort, $grid } = params;
//           let fetchParams: SmartTableFetchParams = {};
//           if (args && args.length > 0) {
//             fetchParams = args[0];
//           }
//           const searchParameter: SmartTableAjaxQueryParams = merge(
//             {
//               $grid,
//               form,
//               filters,
//               page,
//               sorts,
//               sort,
//             },
//             fetchParams,
//           );
//           let ajaxParameter: Record<string, any> = {
//             ...form,
//             ...page,
//           };
//           // 处理排序
//           if (sorts.length > 0 && sortConfig?.remote === true) {
//             const sortNameList: string[] = [];
//             const sortOrderList: string[] = [];
//             for (const item of sorts) {
//               sortNameList.push(item.field);
//               sortOrderList.push(item.order);
//             }
//             ajaxParameter.sortName = sortNameList.join(',');
//             ajaxParameter.sortOrder = sortOrderList.join(',');
//           }
//         },
//       };
//     }
//   });
// };
//
// export { useSmartTableAjax };

export default function useSmartTableAjax() {
  // do nothing
}
